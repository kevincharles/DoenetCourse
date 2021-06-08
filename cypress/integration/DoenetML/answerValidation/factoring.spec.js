describe('factor polynomial tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  // Note: even after develop a better factoring test,
  // should keep these tests, as they probe how well
  // we can handle components that change type
  // (due to the multiple conditionalContents that are copied)
  it('factor x^2-1', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <setup>
      <math name="poly">x^2-1</math>
      <math name="ansSimplify"  simplify>$ans</math>
      <extractMathOperator name="originalOperator">$ansSimplify</extractMathOperator>
      <text name="minus">-</text>
      <text name="mult">*</text>
      <text name="div">/</text>
      <conditionalContent assignNames="(ansNoMinus postMinusOperator)">
        <case condition="$originalOperator=$minus">
          <extractMath type="operand" operandNumber="1" name="temp">$ansSimplify</extractMath>
          <extractMathOperator>$temp</extractMathOperator>
        </case>
        <else>$ansSimplify $originalOperator</else>
      </conditionalContent>
      <conditionalContent assignNames="(numerator denominator numeratorOperator)">
        <case condition="$postMinusOperator=$div">
          <extractMath type="operand" operandNumber="1" name="temp2">$ansNoMinus</extractMath>
          <extractMath type="operand" operandNumber="2">$ansNoMinus</extractMath>
          <extractMathOperator>$temp2</extractMathOperator>
        </case>
        <else>$ansNoMinus <math>1</math> $postMinusOperator</else>
      </conditionalContent>
    </setup>
  
    <p>Question: Factor the polynomial <math expand simplify>$poly</math>.</p>
    
    <p>Answer <mathinput name="ans" /></p>

    <answer name="check">
      <award>
        <when>
          $ans = $poly
          and
          $numeratorOperator = $mult
          and
          <isNumber>$denominator</isNumber>
          and
          (
            <extractMath type="numberOfOperands">$numerator</extractMath> = 3
            or not
            (
              <isNumber><extractMath type="operand" operandNumber="1">$numerator</extractMath></isNumber>
              or
              <isNumber><extractMath type="operand" operandNumber="1">$numerator</extractMath></isNumber>
            )
          )
        </when>
      </award>
    </answer>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('x^2-1')
    cy.get('#\\/ans textarea').type('x^2{rightArrow}-1{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('(2x^2-2)/2')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(2x^2{rightArrow}-2)/2{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('(x-1)(x+1)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(x-1)(x+1){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(1-x)(x+1)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(1-x)(x+1){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('-(1-x)(x+1)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}-(1-x)(x+1){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    // verify bug from changing component types is fixed
    cy.log('swap minus signs a few times')
    cy.get('#\\/ans textarea').type('{home}{rightarrow}{backspace}{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')
    cy.get('#\\/ans textarea').type('{home}-{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.get('#\\/ans textarea').type('{home}{rightarrow}{backspace}{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')
    cy.get('#\\/ans textarea').type('{home}-{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.get('#\\/ans textarea').type('{home}{rightarrow}{backspace}{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')
    cy.get('#\\/ans textarea').type('{home}-{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(1-x)(-1-x)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(1-x)(-1-x){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('-(1-x)(-1-x)')
    cy.get('#\\/ans textarea').type('{home}-{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('-(x-1)(-1-x)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}-(x-1)(-1-x){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')


    cy.log('(x^2-1)x/x')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(x^2{rightArrow}-1)x/x{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('(x^2-1)5/5')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(x^2{rightArrow}-1)5/5{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('((x-1)(x+1))')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}((x-1)(x+1)){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(2x-2)(x+1)/2')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(2x-2)(x+1)/2{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('1/2(2x-2)(x+1)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}1/2{rightarrow}(2x-2)(x+1){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('0.5(2x-2)(x+1)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}0.5(2x-2)(x+1){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('0.25(2x-2)(2x+2)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}0.25(2x-2)(2x+2){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')


  });

  it('factor 4x^2-4', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <setup>
      <math name="poly">4x^2-4</math>
      <math name="ansSimplify"  simplify>$ans</math>
      <extractMathOperator name="originalOperator">$ansSimplify</extractMathOperator>
      <text name="minus">-</text>
      <text name="mult">*</text>
      <text name="div">/</text>
      <conditionalContent assignNames="(ansNoMinus postMinusOperator)">
        <case condition="$originalOperator=$minus">
          <extractMath type="operand" operandNumber="1" name="temp">$ansSimplify</extractMath>
          <extractMathOperator>$temp</extractMathOperator>
        </case>
        <else>$ansSimplify $originalOperator</else>
      </conditionalContent>
      <conditionalContent assignNames="(numerator denominator numeratorOperator)">
        <case condition="$postMinusOperator=$div">
          <extractMath type="operand" operandNumber="1" name="temp2">$ansNoMinus</extractMath>
          <extractMath type="operand" operandNumber="2">$ansNoMinus</extractMath>
          <extractMathOperator>$temp2</extractMathOperator>
        </case>
        <else>$ansNoMinus <math>1</math> $postMinusOperator</else>
      </conditionalContent>
    </setup>
  
    <p>Question: Factor the polynomial <math expand simplify>$poly</math>.</p>
    
    <p>Answer <mathinput name="ans" /></p>

    <answer name="check">
      <award>
        <when>
          $ans = $poly
          and
          $numeratorOperator = $mult
          and
          <isNumber>$denominator</isNumber>
          and
          (
            <extractMath type="numberOfOperands">$numerator</extractMath> = 3
            or not
            (
              <isNumber><extractMath type="operand" operandNumber="1">$numerator</extractMath></isNumber>
              or
              <isNumber><extractMath type="operand" operandNumber="1">$numerator</extractMath></isNumber>
            )
          )
        </when>
      </award>
    </answer>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('4x^2-4')
    cy.get('#\\/ans textarea').type('4x^2{rightArrow}-4{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('4(x-1)(x+1)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}4(x-1)(x+1){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('4(1-x)(x+1)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}4(1-x)(x+1){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('4(1-x)(-1-x)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}4(1-x)(-1-x){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('-4(1-x)(1+x)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}-4(1-x)(1+x){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(1-x)(1+x)(-4)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(1-x)(1+x)(-4){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('2(1-x)(1+x)(-2)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}2(1-x)(1+x)(-2){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(2x-2)(x+1)2')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(2x-2)(x+1)2{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('2(x-1)(2x+2)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}2(x-1)(2x+2){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')


    cy.log('(3x-3)(8x+8)/6')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(3x-3)(8x+8)/6{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(6x-6)(8x+8)/6')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(6x-6)(8x+8)/6{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')


    cy.log('0.5(6x-6)(4x+4)/3')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}0.5(6x-6)(4x+4)/3{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

  });

  it('factor (6z-4)(5z+10)', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <setup>
      <math name="poly">(6z-4)(5z+10)</math>
      <math name="ansSimplify"  simplify>$ans</math>
      <extractMathOperator name="originalOperator">$ansSimplify</extractMathOperator>
      <text name="minus">-</text>
      <text name="mult">*</text>
      <text name="div">/</text>
      <conditionalContent assignNames="(ansNoMinus postMinusOperator)">
        <case condition="$originalOperator=$minus">
          <extractMath type="operand" operandNumber="1" name="temp">$ansSimplify</extractMath>
          <extractMathOperator>$temp</extractMathOperator>
        </case>
        <else>$ansSimplify $originalOperator</else>
      </conditionalContent>
      <conditionalContent assignNames="(numerator denominator numeratorOperator)">
        <case condition="$postMinusOperator=$div">
          <extractMath type="operand" operandNumber="1" name="temp2">$ansNoMinus</extractMath>
          <extractMath type="operand" operandNumber="2">$ansNoMinus</extractMath>
          <extractMathOperator>$temp2</extractMathOperator>
        </case>
        <else>$ansNoMinus <math>1</math> $postMinusOperator</else>
      </conditionalContent>
    </setup>
  
    <p>Question: Factor the polynomial <math expand simplify>$poly</math>.</p>
    
    <p>Answer <mathinput name="ans" /></p>

    <answer name="check">
      <award>
        <when>
          $ans = $poly
          and
          $numeratorOperator = $mult
          and
          <isNumber>$denominator</isNumber>
          and
          (
            <extractMath type="numberOfOperands">$numerator</extractMath> = 3
            or not
            (
              <isNumber><extractMath type="operand" operandNumber="1">$numerator</extractMath></isNumber>
              or
              <isNumber><extractMath type="operand" operandNumber="1">$numerator</extractMath></isNumber>
            )
          )
        </when>
      </award>
    </answer>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('30z^2+40z-40')
    cy.get('#\\/ans textarea').type('30z^2{rightArrow}+40z-40{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('(6z-4)(5z+10)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(6z-4)(5z+10){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('5(6z-4)(z+2)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}5(6z-4)(z+2){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('5(4-6z)(z+2)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}5(4-6z)(z+2){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('5(2-3z)(z+2)(-2)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}5(2-3z)(z+2)(-2){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('15(2-3z)(z+2)(-2)/3')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}15(2-3z)(z+2)(-2)/3{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('15(2-3z)3(z+2)(-2)/9')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}15(2-3z)3(z+2)(-2)/9{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

  });

  it('factor (3q+2r)(6s+8t)', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <setup>
      <math name="poly">(3q+2r)(6s+8t)</math>
      <math name="ansSimplify"  simplify>$ans</math>
      <extractMathOperator name="originalOperator">$ansSimplify</extractMathOperator>
      <text name="minus">-</text>
      <text name="mult">*</text>
      <text name="div">/</text>
      <conditionalContent assignNames="(ansNoMinus postMinusOperator)">
        <case condition="$originalOperator=$minus">
          <extractMath type="operand" operandNumber="1" name="temp">$ansSimplify</extractMath>
          <extractMathOperator>$temp</extractMathOperator>
        </case>
        <else>$ansSimplify $originalOperator</else>
      </conditionalContent>
      <conditionalContent assignNames="(numerator denominator numeratorOperator)">
        <case condition="$postMinusOperator=$div">
          <extractMath type="operand" operandNumber="1" name="temp2">$ansNoMinus</extractMath>
          <extractMath type="operand" operandNumber="2">$ansNoMinus</extractMath>
          <extractMathOperator>$temp2</extractMathOperator>
        </case>
        <else>$ansNoMinus <math>1</math> $postMinusOperator</else>
      </conditionalContent>
    </setup>
  
    <p>Question: Factor the polynomial <math expand simplify>$poly</math>.</p>
    
    <p>Answer <mathinput name="ans" /></p>

    <answer name="check">
      <award>
        <when>
          $ans = $poly
          and
          $numeratorOperator = $mult
          and
          <isNumber>$denominator</isNumber>
          and
          (
            <extractMath type="numberOfOperands">$numerator</extractMath> = 3
            or not
            (
              <isNumber><extractMath type="operand" operandNumber="1">$numerator</extractMath></isNumber>
              or
              <isNumber><extractMath type="operand" operandNumber="1">$numerator</extractMath></isNumber>
            )
          )
        </when>
      </award>
    </answer>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('18qs+24qt+12rs+16rt')
    cy.get('#\\/ans textarea').type('30z^2{rightArrow}+40z-40{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('(3q+2r)(6s+8t)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(3q+2r)(6s+8t){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('3q(6s+8t) + 2r(6s+8t)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}3q(6s+8t) + 2r(6s+8t){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('(6s+8t)(3q+2r)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(6s+8t)(3q+2r){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(8t+6s)(3q+2r)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(8t+6s)(3q+2r){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(8t+6s)(2r+3q)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(8t+6s)(2r+3q){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(8t+6s)(2r+q+q+q)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(8t+6s)(2r+q+q+q){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(4t+3s)2(2r+3q)')
    cy.get('#\\/ans textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(4t+3s)2(2r+3q){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

  });


});