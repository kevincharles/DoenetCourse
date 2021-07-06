import {useRef} from "../../_snowpack/pkg/react.js";
import {atom, useRecoilValue, useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily, toolViewAtom} from "../NewToolRoot.js";
import {mainPanelClickAtom} from "../Panels/NewMainPanel.js";
import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
export const drivecardSelectedNodesAtom = atom({
  key: "drivecardSelectedNodesAtom",
  default: []
});
export default function CourseToolHandler() {
  console.log(">>>===CourseToolHandler");
  let lastAtomTool = useRef(null);
  const setTool = useRecoilCallback(({set}) => (tool, lastAtomTool2) => {
    if (tool === "") {
      tool = "courseChooser";
      window.history.replaceState("", "", "/new#/course?tool=courseChooser");
    }
    if (tool === lastAtomTool2) {
      return;
    }
    if (tool === "courseChooser") {
      set(toolViewAtom, (was) => {
        let newObj = {...was};
        newObj.currentMainPanel = "DriveCards";
        newObj.currentMenus = ["CreateCourse", "CourseEnroll"];
        newObj.menusTitles = ["Create Course", "Enroll"];
        newObj.menusInitOpen = [true, false];
        return newObj;
      });
      set(selectedMenuPanelAtom, "");
      set(mainPanelClickAtom, [{atom: drivecardSelectedNodesAtom, value: []}, {atom: selectedMenuPanelAtom, value: ""}]);
    } else if (tool === "navigation") {
      set(toolViewAtom, (was) => {
        let newObj = {...was};
        newObj.currentMainPanel = "DrivePanel";
        newObj.currentMenus = ["AddDriveItems", "EnrollStudents"];
        newObj.menusTitles = ["Add Items", "Enrollment"];
        newObj.menusInitOpen = [true, false];
        return newObj;
      });
      set(selectedMenuPanelAtom, "");
      set(mainPanelClickAtom, []);
    } else if (tool === "editor") {
      console.log(">>>editor!");
      set(selectedMenuPanelAtom, "");
      set(mainPanelClickAtom, []);
    } else {
      console.log(">>>didn't match!");
    }
  });
  const atomTool = useRecoilValue(searchParamAtomFamily("tool"));
  if (atomTool !== lastAtomTool.current) {
    setTool(atomTool, lastAtomTool.current);
    lastAtomTool.current = atomTool;
  }
  return null;
}
