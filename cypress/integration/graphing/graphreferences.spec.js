describe('Graph Reference Test', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('(slow)graph referenced multiple ways', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="graphA">
      <point name="pointA">(1,2)</point>
      <point name="pointB">(-2,4)</point>
      <line name="lineA">y=x+1</line>
      <line name="lineB" through="$pointA $pointB" />
      <copy name="pointC" tname="pointA" />
      <point name="pointD" x="$(pointA{prop='x'})" y="$(pointB{prop='y'})" />
      <copy name="lineC" tname="lineA" />
      <copy name="lineD" tname="lineB" />
      <intersection name="pointE"><copy tname="lineA" /><copy tname="lineB" /></intersection>
    </graph>

    <graph name="graphB">
      $pointA$pointB$lineA$lineB$pointC$pointD$lineC$lineD$pointE
    </graph>

    <copy name="graphC" tname="graphA" />

    <copy name="graphD" tname="graphB" />

    <copy name="graphE" tname="graphC" />

    <copy name="graphF" tname="graphD" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let graphB = components["/graphB"];
      let graphC = components["/graphC"].replacements[0];
      let graphD = components["/graphD"].replacements[0];
      let graphE = components["/graphE"].replacements[0];
      let graphF = components["/graphF"].replacements[0];
      let pointsA = [
        '/pointA', 
        components['/pointC'].replacements[0].componentName,
        graphB.activeChildren[0].componentName,
        graphB.activeChildren[4].componentName,
        graphC.activeChildren[0].componentName,
        graphC.activeChildren[4].componentName,
        graphD.activeChildren[0].componentName,
        graphD.activeChildren[4].componentName,
        graphE.activeChildren[0].componentName,
        graphE.activeChildren[4].componentName,
        graphF.activeChildren[0].componentName,
        graphF.activeChildren[4].componentName,
      ];

      let pointsB = [
        '/pointB',
        graphB.activeChildren[1].componentName,
        graphC.activeChildren[1].componentName,
        graphD.activeChildren[1].componentName,
        graphE.activeChildren[1].componentName,
        graphF.activeChildren[1].componentName,
      ];

      let pointsD = [
        '/pointD',
        graphB.activeChildren[5].componentName,
        graphC.activeChildren[5].componentName,
        graphD.activeChildren[5].componentName,
        graphE.activeChildren[5].componentName,
        graphF.activeChildren[5].componentName,
      ];

      let pointsE = [
        components['/pointE'].replacements[0].componentName,
        graphB.activeChildren[8].componentName,
        graphC.activeChildren[8].componentName,
        graphD.activeChildren[8].componentName,
        graphE.activeChildren[8].componentName,
        graphF.activeChildren[8].componentName,
      ];

      let linesA = [
        '/lineA', 
        components['/lineC'].replacements[0].componentName,
        graphB.activeChildren[2].componentName,
        graphB.activeChildren[6].componentName,
        graphC.activeChildren[2].componentName,
        graphC.activeChildren[6].componentName,
        graphD.activeChildren[2].componentName,
        graphD.activeChildren[6].componentName,
        graphE.activeChildren[2].componentName,
        graphE.activeChildren[6].componentName,
        graphF.activeChildren[2].componentName,
        graphF.activeChildren[6].componentName,
      ];


      let linesB = [
        '/lineB', 
        components['/lineD'].replacements[0].componentName,
        graphB.activeChildren[3].componentName,
        graphB.activeChildren[7].componentName,
        graphC.activeChildren[3].componentName,
        graphC.activeChildren[7].componentName,
        graphD.activeChildren[3].componentName,
        graphD.activeChildren[7].componentName,
        graphE.activeChildren[3].componentName,
        graphE.activeChildren[7].componentName,
        graphF.activeChildren[3].componentName,
        graphF.activeChildren[7].componentName,
      ];
      
      let pointAx = 1;
      let pointAy = 2;
      let pointBx = -2;
      let pointBy = 4;
      let slopeA = 1;
      let xinterceptA = -1;
      let yinterceptA = 1;
      let slopeB = (pointBy - pointAy) / (pointBx - pointAx);
      let xinterceptB = -pointAy / slopeB + pointAx;
      let yinterceptB = pointAy - slopeB * pointAx;
      let pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
      let pointEy = slopeA * pointEx + yinterceptA;


      cy.log(`check original configuration`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let point of pointsA) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointAy, 1E-12);
        }
        for (let point of pointsB) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointBx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsD) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsE) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointEx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointEy, 1E-12);
        }
        for (let line of linesA) {
          expect(components[line].stateValues.slope.evaluate_to_constant()).closeTo(slopeA, 1E-12);
          expect(components[line].stateValues.xintercept.evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
          expect(components[line].stateValues.yintercept.evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
        }
        for (let line of linesB) {
          expect(components[line].stateValues.slope.evaluate_to_constant()).closeTo(slopeB, 1E-12);
          expect(components[line].stateValues.xintercept.evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
          expect(components[line].stateValues.yintercept.evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
        }
      })

      cy.log(`move points and line in first graph`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        pointAx = -3;
        pointAy = 6;
        pointBx = 4;
        pointBy = -2;
        components['/pointA'].movePoint({ x: pointAx, y: pointAy });
        components['/pointB'].movePoint({ x: pointBx, y: pointBy });

        let moveUp = -3;
        let point1coords = [
          components['/lineA'].stateValues.points[0][0],
          components['/lineA'].stateValues.points[0][1],
        ];
        let point2coords = [
          components['/lineA'].stateValues.points[1][0],
          components['/lineA'].stateValues.points[1][1],
        ];
        point1coords[1] = point1coords[1].add(moveUp);
        point2coords[1] = point2coords[1].add(moveUp);
        components['/lineA'].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        xinterceptA -= moveUp;
        yinterceptA += moveUp;;
        slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        xinterceptB = -pointAy / slopeB + pointAx;
        yinterceptB = pointAy - slopeB * pointAx;
        pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        pointEy = slopeA * pointEx + yinterceptA;

        for (let point of pointsA) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointAy, 1E-12);
        }
        for (let point of pointsB) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointBx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsD) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsE) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointEx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointEy, 1E-12);
        }
        for (let line of linesA) {
          expect(components[line].stateValues.slope.evaluate_to_constant()).closeTo(slopeA, 1E-12);
          expect(components[line].stateValues.xintercept.evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
          expect(components[line].stateValues.yintercept.evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
        }
        for (let line of linesB) {
          expect(components[line].stateValues.slope.evaluate_to_constant()).closeTo(slopeB, 1E-12);
          expect(components[line].stateValues.xintercept.evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
          expect(components[line].stateValues.yintercept.evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
        }
      })


      cy.log(`move shadow points and line in second graph`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let pointDx = 3;
        let pointDy = 2;
        let pointCy = -9;

        components[pointsD[1]].movePoint({ x: pointDx, y: pointDy });
        components[pointsA[3]].movePoint({ x: pointDx, y: pointCy });

        pointAx = pointDx;
        pointAy = pointCy;
        pointBy = pointDy;

        let moveUp = 8;
        let point1coords = [
          components[linesA[3]].stateValues.points[0][0],
          components[linesA[3]].stateValues.points[0][1],
        ];
        let point2coords = [
          components[linesA[3]].stateValues.points[1][0],
          components[linesA[3]].stateValues.points[1][1],
        ];
        point1coords[1] = point1coords[1].add(moveUp);
        point2coords[1] = point2coords[1].add(moveUp);
        components[linesA[3]].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        xinterceptA -= moveUp;
        yinterceptA += moveUp;;
        slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        xinterceptB = -pointAy / slopeB + pointAx;
        yinterceptB = pointAy - slopeB * pointAx;
        pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        pointEy = slopeA * pointEx + yinterceptA;


        for (let point of pointsA) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointAy, 1E-12);
        }
        for (let point of pointsB) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointBx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsD) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsE) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointEx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointEy, 1E-12);
        }
        for (let line of linesA) {
          expect(components[line].stateValues.slope.evaluate_to_constant()).closeTo(slopeA, 1E-12);
          expect(components[line].stateValues.xintercept.evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
          expect(components[line].stateValues.yintercept.evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
        }
        for (let line of linesB) {
          expect(components[line].stateValues.slope.evaluate_to_constant()).closeTo(slopeB, 1E-12);
          expect(components[line].stateValues.xintercept.evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
          expect(components[line].stateValues.yintercept.evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
        }
      })


      cy.log(`move both shadow lines in third graph`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let moveUp = -4;
        let point1coords = [
          components[linesA[5]].stateValues.points[0][0],
          components[linesA[5]].stateValues.points[0][1],
        ];
        let point2coords = [
          components[linesA[5]].stateValues.points[1][0],
          components[linesA[5]].stateValues.points[1][1],
        ];
        point1coords[1] = point1coords[1].add(moveUp);
        point2coords[1] = point2coords[1].add(moveUp);
        components[linesA[5]].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        xinterceptA -= moveUp;
        yinterceptA += moveUp;;


        let moveX = 3;
        let moveY = 2;
        point1coords = [
          components[linesB[5]].stateValues.points[0][0],
          components[linesB[5]].stateValues.points[0][1],
        ];
        point2coords = [
          components[linesB[5]].stateValues.points[1][0],
          components[linesB[5]].stateValues.points[1][1],
        ];
        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);
        components[linesB[5]].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        pointAx += moveX;
        pointAy += moveY;
        pointBx += moveX;
        pointBy += moveY;

        slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        xinterceptB = -pointAy / slopeB + pointAx;
        yinterceptB = pointAy - slopeB * pointAx;
        pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        pointEy = slopeA * pointEx + yinterceptA;


        for (let point of pointsA) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointAy, 1E-12);
        }
        for (let point of pointsB) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointBx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsD) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsE) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointEx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointEy, 1E-12);
        }
        for (let line of linesA) {
          expect(components[line].stateValues.slope.evaluate_to_constant()).closeTo(slopeA, 1E-12);
          expect(components[line].stateValues.xintercept.evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
          expect(components[line].stateValues.yintercept.evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
        }
        for (let line of linesB) {
          expect(components[line].stateValues.slope.evaluate_to_constant()).closeTo(slopeB, 1E-12);
          expect(components[line].stateValues.xintercept.evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
          expect(components[line].stateValues.yintercept.evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
        }
      })


      cy.log(`move shadow points and line in fourth graph`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let pointDx = -5;
        let pointDy = -1;
        let pointCy = 5;

        components[pointsA[7]].movePoint({ x: pointDx, y: pointCy });
        components[pointsD[3]].movePoint({ x: pointDx, y: pointDy });

        pointAx = pointDx;
        pointAy = pointCy;
        pointBy = pointDy;

        let moveUp = 1;
        let point1coords = [
          components[linesA[7]].stateValues.points[0][0],
          components[linesA[7]].stateValues.points[0][1],
        ];
        let point2coords = [
          components[linesA[7]].stateValues.points[1][0],
          components[linesA[7]].stateValues.points[1][1],
        ];
        point1coords[1] = point1coords[1].add(moveUp);
        point2coords[1] = point2coords[1].add(moveUp);
        components[linesA[7]].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        xinterceptA -= moveUp;
        yinterceptA += moveUp;;
        slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        xinterceptB = -pointAy / slopeB + pointAx;
        yinterceptB = pointAy - slopeB * pointAx;
        pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        pointEy = slopeA * pointEx + yinterceptA;


        for (let point of pointsA) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointAy, 1E-12);
        }
        for (let point of pointsB) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointBx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsD) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsE) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointEx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointEy, 1E-12);
        }
        for (let line of linesA) {
          expect(components[line].stateValues.slope.evaluate_to_constant()).closeTo(slopeA, 1E-12);
          expect(components[line].stateValues.xintercept.evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
          expect(components[line].stateValues.yintercept.evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
        }
        for (let line of linesB) {
          expect(components[line].stateValues.slope.evaluate_to_constant()).closeTo(slopeB, 1E-12);
          expect(components[line].stateValues.xintercept.evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
          expect(components[line].stateValues.yintercept.evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
        }
      })


      cy.log(`move points and line in fifth graph`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        pointAx = 7;
        pointAy = -7;
        pointBx = -8;
        pointBy = 9;
        components[pointsA[8]].movePoint({ x: pointAx, y: pointAy });
        components[pointsB[4]].movePoint({ x: pointBx, y: pointBy });

        let moveUp = -3;
        let point1coords = [
          components[linesA[8]].stateValues.points[0][0],
          components[linesA[8]].stateValues.points[0][1],
        ];
        let point2coords = [
          components[linesA[8]].stateValues.points[1][0],
          components[linesA[8]].stateValues.points[1][1],
        ];
        point1coords[1] = point1coords[1].add(moveUp);
        point2coords[1] = point2coords[1].add(moveUp);
        components[linesA[8]].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        xinterceptA -= moveUp;
        yinterceptA += moveUp;;
        slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        xinterceptB = -pointAy / slopeB + pointAx;
        yinterceptB = pointAy - slopeB * pointAx;
        pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        pointEy = slopeA * pointEx + yinterceptA;

        for (let point of pointsA) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointAy, 1E-12);
        }
        for (let point of pointsB) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointBx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsD) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsE) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointEx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointEy, 1E-12);
        }
        for (let line of linesA) {
          expect(components[line].stateValues.slope.evaluate_to_constant()).closeTo(slopeA, 1E-12);
          expect(components[line].stateValues.xintercept.evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
          expect(components[line].stateValues.yintercept.evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
        }
        for (let line of linesB) {
          expect(components[line].stateValues.slope.evaluate_to_constant()).closeTo(slopeB, 1E-12);
          expect(components[line].stateValues.xintercept.evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
          expect(components[line].stateValues.yintercept.evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
        }
      })


      cy.log(`move both shadow lines in sixth graph`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let moveUp = -2;
        let point1coords = [
          components[linesA[11]].stateValues.points[0][0],
          components[linesA[11]].stateValues.points[0][1],
        ];
        let point2coords = [
          components[linesA[11]].stateValues.points[1][0],
          components[linesA[11]].stateValues.points[1][1],
        ];
        point1coords[1] = point1coords[1].add(moveUp);
        point2coords[1] = point2coords[1].add(moveUp);
        components[linesA[11]].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        xinterceptA -= moveUp;
        yinterceptA += moveUp;;


        let moveX = -1;
        let moveY = 3;
        point1coords = [
          components[linesB[11]].stateValues.points[0][0],
          components[linesB[11]].stateValues.points[0][1],
        ];
        point2coords = [
          components[linesB[11]].stateValues.points[1][0],
          components[linesB[11]].stateValues.points[1][1],
        ];
        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);
        components[linesB[11]].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        pointAx += moveX;
        pointAy += moveY;
        pointBx += moveX;
        pointBy += moveY;

        slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        xinterceptB = -pointAy / slopeB + pointAx;
        yinterceptB = pointAy - slopeB * pointAx;
        pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        pointEy = slopeA * pointEx + yinterceptA;


        for (let point of pointsA) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointAy, 1E-12);
        }
        for (let point of pointsB) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointBx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsD) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsE) {
          expect(components[point].stateValues.xs[0].tree).closeTo(pointEx, 1E-12);
          expect(components[point].stateValues.xs[1].tree).closeTo(pointEy, 1E-12);
        }
        for (let line of linesA) {
          expect(components[line].stateValues.slope.evaluate_to_constant()).closeTo(slopeA, 1E-12);
          expect(components[line].stateValues.xintercept.evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
          expect(components[line].stateValues.yintercept.evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
        }
        for (let line of linesB) {
          expect(components[line].stateValues.slope.evaluate_to_constant()).closeTo(slopeB, 1E-12);
          expect(components[line].stateValues.xintercept.evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
          expect(components[line].stateValues.yintercept.evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
        }
      })

    });
  });

});