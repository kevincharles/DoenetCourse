import React from "../../_snowpack/pkg/react.js";
import {useLocation} from "../../_snowpack/pkg/react-router.js";
import {useRecoilCallback, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {toolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
import {globalSelectedNodesAtom} from "../../_reactComponents/Drive/NewDrive.js";
let encodeParams = (p) => Object.entries(p).map((kv) => kv.map(encodeURIComponent).join("=")).join("&");
export default function DrivePanel(props) {
  console.log(">>>===DrivePanel");
  const path = useRecoilValue(searchParamAtomFamily("path"));
  let location = useLocation();
  const setPath = useRecoilCallback(({set}) => (path2) => {
    let urlParamsObj = Object.fromEntries(new URLSearchParams(location.search));
    urlParamsObj["path"] = path2;
    const url = location.pathname + "?" + encodeParams(urlParamsObj);
    window.history.pushState("", "", `/new#${url}`);
    set(searchParamAtomFamily("path"), path2);
  });
  const setSelections = useRecoilCallback(({set}) => (selections) => {
    set(globalSelectedNodesAtom, selections);
  });
  if (props.style?.display === "none") {
    return /* @__PURE__ */ React.createElement("div", {
      style: props.style
    });
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement("h1", null, "drive"), /* @__PURE__ */ React.createElement("p", null, "put drive here"), /* @__PURE__ */ React.createElement("div", null, "path: ", path), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: () => setPath("f1")
  }, "path to f1")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: () => setPath("f2")
  }, "path to f2")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: () => setPath("f3")
  }, "path to f3")), /* @__PURE__ */ React.createElement("hr", null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: () => setSelections(["f1"])
  }, "select f1")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: () => setSelections(["f1", "f2"])
  }, "select f1 and f2")));
}
