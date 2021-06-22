import React, {useState} from "../../_snowpack/pkg/react.js";
import {
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import {toolViewAtom} from "../NewToolRoot.js";
export default function TestControl(props) {
  const [count, setCount] = useState(1);
  const mainPanel = useRecoilCallback(({set}) => (panelName) => {
    set(toolViewAtom, (was) => {
      let newObj = {...was};
      newObj.mainPanelType = panelName;
      return newObj;
    });
  });
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement("h1", null, "State Count ", count), /* @__PURE__ */ React.createElement("button", {
    onClick: () => setCount((was) => {
      return was + 1;
    })
  }, "+"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: () => mainPanel("One")
  }, "Switch to One")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: () => mainPanel("Two")
  }, "Switch to Two")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: () => mainPanel("Count")
  }, "Switch to Count")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: () => mainPanel("Count2")
  }, "Switch to Count2")));
}
