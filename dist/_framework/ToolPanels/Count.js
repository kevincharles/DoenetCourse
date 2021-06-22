import React, {useState} from "../../_snowpack/pkg/react.js";
export default function Count(props) {
  console.log(">>>===Count");
  const [count, setCount] = useState(1);
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement("h1", null, "Count ", count), /* @__PURE__ */ React.createElement("button", {
    onClick: () => setCount((was) => {
      return was + 1;
    })
  }, "+"));
}
