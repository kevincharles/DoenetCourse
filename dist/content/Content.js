import React from "../_snowpack/pkg/react.js";
import Tool from "../_framework/Tool.js";
import DoenetViewer from "../viewer/DoenetViewer.js";
export default function Content(props) {
  let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
  const contentId = urlParamsObj?.contentId;
  const attemptNumber = 1;
  const showCorrectness = true;
  const readOnly = false;
  const solutionDisplayMode = "button";
  const showFeedback = true;
  const showHints = true;
  const ignoreDatabase = true;
  const requestedVariant = {index: 1};
  return /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("headerPanel", {
    title: "Content"
  }), /* @__PURE__ */ React.createElement("mainPanel", null, contentId ? /* @__PURE__ */ React.createElement(DoenetViewer, {
    key: "doenetviewer",
    contentId,
    flags: {
      showCorrectness,
      readOnly,
      solutionDisplayMode,
      showFeedback,
      showHints
    },
    attemptNumber,
    ignoreDatabase,
    requestedVariant
  }) : /* @__PURE__ */ React.createElement("p", null, "Need a contentId to display content...!")));
}
