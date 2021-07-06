import React, {useEffect} from "../../_snowpack/pkg/react.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {useRecoilCallback, useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
import {drivecardSelectedNodesAtom} from "../ToolHandlers/CourseToolHandler.js";
import {toolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
import DriveCards from "../../_reactComponents/Drive/DriveCards.js";
export default function DriveCardsNew(props) {
  const driveId = useRecoilValue(drivecardSelectedNodesAtom);
  const setSelectedCourse = useRecoilCallback(({set}) => (driveIds) => {
    set(drivecardSelectedNodesAtom, driveIds);
    set(selectedMenuPanelAtom, "SelectedCourse");
  }, []);
  const goToNav = useRecoilCallback(({set}) => () => {
    window.history.pushState("", "", "/new#/course?tool=navigation");
    set(searchParamAtomFamily("tool"), "navigation");
  }, []);
  const tempChangeMenus = useRecoilCallback(({set}) => (newMenus, menusTitles, initOpen) => {
    set(toolViewAtom, (was) => {
      let newObj = {...was};
      newObj.currentMenus = newMenus;
      newObj.menusTitles = menusTitles;
      newObj.menusInitOpen = initOpen;
      return newObj;
    });
  });
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement("h1", null, "Drive Cards"), driveId.map((item) => {
    return /* @__PURE__ */ React.createElement("p", null, item.label);
  }), /* @__PURE__ */ React.createElement("hr", null), /* @__PURE__ */ React.createElement("h2", null, "Selection Experiment"), /* @__PURE__ */ React.createElement("button", {
    onClick: (e) => {
      e.stopPropagation();
      setSelectedCourse(["A Id", "B Id"]);
    }
  }, "Test A & BSelection"), /* @__PURE__ */ React.createElement("button", {
    onClick: (e) => {
      e.stopPropagation();
      setSelectedCourse(["A Id"]);
    }
  }, "Test A Selection"), /* @__PURE__ */ React.createElement("hr", null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: (e) => {
      e.stopPropagation();
      goToNav();
    }
  }, "Go To navigation")));
}
