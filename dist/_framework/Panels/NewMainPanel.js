import React from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import Profile from "../Profile.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faChevronRight} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
const ContentWrapper = styled.div`
  grid-area: mainPanel;
  background-color: hsl(0, 0%, 99%);
  height: 100%;
  // border-radius: 0 0 4px 4px;
  overflow: auto;
`;
const ControlsWrapper = styled.div`
  grid-area: mainControls;
  display: flex;
  gap: 4px;
  background-color: hsl(0, 0%, 99%);
  // border-radius: 4px 4px 0 0;
  overflow: auto hidden;
  // border-bottom: 2px solid #e3e3e3;
`;
const OpenButton = styled.button`
background-color: #1A5A99;
height: 35px;
width: 20px;
color: white;
border: none;
display: inline-block;
`;
export default function MainPanel({children, setMenuPanelsOpen, displayProfile}) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ControlsWrapper, null, displayProfile ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(OpenButton, {
    onClick: () => setMenuPanelsOpen(true)
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faChevronRight
  })), /* @__PURE__ */ React.createElement(Profile, null)) : null), /* @__PURE__ */ React.createElement(ContentWrapper, null, children));
}
