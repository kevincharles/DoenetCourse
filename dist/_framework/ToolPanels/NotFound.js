import React from "../../_snowpack/pkg/react.js";
import {useLocation} from "../../_snowpack/pkg/react-router-dom.js";
export default function NotFound(props) {
  console.log(">>>===NotFound");
  const location = useLocation();
  let urlParamsObj = Object.fromEntries(new URLSearchParams(location.search));
  console.log(">>>urlParamsObj?.path", urlParamsObj?.path);
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement("h1", null, 'Sorry! "', urlParamsObj?.path, '" was not found.'));
}
