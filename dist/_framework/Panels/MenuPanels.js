import React, {useContext, useState, useEffect, lazy, useRef, Suspense} from "../../_snowpack/pkg/react.js";
import {atomFamily, useRecoilState, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faChevronLeft} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import Profile from "../Profile.js";
const MenuPanelsWrapper = styled.div`
  grid-area: menuPanel;
  display: flex;
  flex-direction: column;
  overflow: auto;
  justify-content: flex-start;
  background: #e3e3e3;
  height: 100%;
  width: 240px;
`;
const MenuPanelsCap = styled.div`
width: 240px;
height: 35px;
background: white;
display: flex;
justify-content: space-between;
align-items: center;
`;
const MenuHeaderButton = styled.button`
  border: none;
  border-top: ${({linkedPanel, activePanel}) => linkedPanel === activePanel ? "8px solid #1A5A99" : "none"};
  background-color: hsl(0, 0%, 99%);
  border-bottom: 2px solid
    ${({linkedPanel, activePanel}) => linkedPanel === activePanel ? "#white" : "black"};
  width: 100%;
  height: 100%;

`;
export const activeMenuPanel = atomFamily({
  key: "activeMenuPanelAtom",
  default: 0
});
export const useMenuPanelController = () => {
  const stackId = useStackId();
  const menuAtomControl = useSetRecoilState(activeMenuPanel(stackId));
  return menuAtomControl;
};
const Logo = styled.div`
background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url('/media/Doenet_Logo_cloud_only.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 50px 25px;
  transition: 300ms;
  // background-color: pink;
  width: 50px;
  height: 25px;
  display: inline-block;
  justify-content: center;
  align-items: center;
  border-style: none;
  margin-top: 5px;
  margin-left: 2px
`;
const CloseButton = styled.button`
background-color: #1A5A99;
height: 35px;
width: 20px;
color: white;
border: none;
display: inline-block;
`;
const EditMenuPanels = styled.button`
background-color: #1A5A99;
height: 35px;
width: 35px;
border: none;
color: white;
border-radius: 17.5px;
font-size: 24px
`;
const MenuPanelTitle = styled.button`
width: 240px;
height: 35px;
background: white;
display: flex;
justify-content: center;
align-items: center;
border: 0px solid white;
// border-top: 1px solid black;
border-bottom: ${(props) => props.isOpen ? "2px solid black" : "0px solid black"} ;
margin-top: 2px;
`;
function MenuPanel(props) {
  let isInitOpen = props.isInitOpen;
  if (!isInitOpen) {
    isInitOpen = false;
  }
  let [isOpen, setIsOpen] = useState(isInitOpen);
  let hideShowStyle = null;
  if (!isOpen) {
    hideShowStyle = "none";
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(MenuPanelTitle, {
    isOpen,
    onClick: () => setIsOpen((was) => !was)
  }, props.title), /* @__PURE__ */ React.createElement("div", {
    style: {
      display: hideShowStyle,
      paddingBottom: "4px",
      paddingLeft: "4px",
      paddingRight: "4px",
      backgroundColor: "white"
    }
  }, props.children));
}
const LoadingFallback = styled.div`
  background-color: hsl(0, 0%, 99%);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  width: 100vw;
  height: 100vh;
`;
export default function MenuPanels({panelTitles = [], panelTypes = [], initOpen = [], setMenuPanelsOpen}) {
  const viewPanels = useRef([]);
  const LazyObj = useRef({
    TestControl: lazy(() => import("../MenuPanels/TestControl.js")),
    ToastTest: lazy(() => import("../MenuPanels/ToastTest.js"))
  }).current;
  function buildMenuPanel({key, type, title, visible, initOpen: initOpen2}) {
    let hideStyle = null;
    if (!visible) {
      hideStyle = "none";
    }
    return /* @__PURE__ */ React.createElement(MenuPanel, {
      key,
      title,
      isInitOpen: initOpen2
    }, /* @__PURE__ */ React.createElement(Suspense, {
      fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, "loading...")
    }, React.createElement(LazyObj[type], {key, style: {display: hideStyle}})));
  }
  if (viewPanels.current.length === 0 && panelTypes.length > 0) {
    for (let [i, panelName] of Object.entries(panelTypes)) {
      const mpKey = `${panelName}`;
      const isOpen = initOpen[i];
      const title = panelTitles[i];
      console.log(">>>panelName", panelName);
      viewPanels.current.push(buildMenuPanel({key: mpKey, type: panelName, title, visible: true, initOpen: isOpen}));
    }
  }
  return /* @__PURE__ */ React.createElement(MenuPanelsWrapper, null, /* @__PURE__ */ React.createElement(MenuPanelsCap, null, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(Logo, null)), /* @__PURE__ */ React.createElement("span", {
    style: {marginBottom: "1px"}
  }, "Doenet"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(Profile, null)), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(CloseButton, {
    onClick: () => setMenuPanelsOpen(false)
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faChevronLeft
  })))), viewPanels.current, /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", justifyContent: "center", alignItems: "center", width: "240px", paddingTop: "8px"}
  }, /* @__PURE__ */ React.createElement(EditMenuPanels, {
    onClick: () => console.log(">>>edit menu panels")
  }, "+")));
}
