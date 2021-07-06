import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
import {HotTable} from "../../_snowpack/pkg/@handsontable/react.js";
import {HyperFormula} from "../../_snowpack/pkg/hyperformula.js";
import "../../_snowpack/pkg/handsontable/dist/handsontable.full.css.proxy.js";
import {sizeToCSS} from "./utils/css.js";
export default class SpreadsheetRenderer extends DoenetRenderer {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    return /* @__PURE__ */ React.createElement("div", {
      id: this.componentName
    }, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), /* @__PURE__ */ React.createElement(HotTable, {
      licenseKey: "non-commercial-and-evaluation",
      data: this.doenetSvData.cells.map((x) => [...x]),
      colHeaders: true,
      rowHeaders: true,
      width: sizeToCSS(this.doenetSvData.width),
      height: sizeToCSS(this.doenetSvData.height),
      afterChange: this.actions.onChange.bind(this),
      formulas: {
        engine: HyperFormula
      },
      stretchH: "all"
    }));
  }
}
