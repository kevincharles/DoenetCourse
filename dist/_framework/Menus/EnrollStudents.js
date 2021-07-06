import React from "../../_snowpack/pkg/react.js";
import {useToast} from "../Toast.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
export default function EnrollStudents(props) {
  const [toast, toastType] = useToast();
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    onClick: () => toast("Stub Enroll!", toastType.SUCCESS),
    value: "Go to Enrollment"
  }, "Go to Enrollment"));
}
