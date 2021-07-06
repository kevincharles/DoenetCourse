import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {drivecardSelectedNodesAtom} from "../ToolHandlers/CourseToolHandler.js";
export default function SelectedCourse(props) {
  const selection = useRecoilValue(drivecardSelectedNodesAtom);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "You have selected course '", selection, "'"));
}
