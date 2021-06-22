import React, {useState, lazy, Suspense, useRef, useEffect} from "../_snowpack/pkg/react.js";
import {
  atom,
  selector,
  useSetRecoilState,
  useRecoilValue,
  useRecoilCallback,
  useRecoilValueLoadable
} from "../_snowpack/pkg/recoil.js";
import styled from "../_snowpack/pkg/styled-components.js";
import Toast from "./Toast.js";
import ContentPanel from "./Panels/NewContentPanel.js";
import axios from "../_snowpack/pkg/axios.js";
import GlobalFont from "../_utils/GlobalFont.js";
import MainPanel from "./Panels/NewMainPanel.js";
import SupportPanel from "./Panels/NewSupportPanel.js";
import MenuPanels from "./Panels/MenuPanels.js";
import FooterPanel from "./Panels/FooterPanel.js";
import {animated} from "../_snowpack/pkg/@react-spring/web.js";
const ToolContainer = styled(animated.div)`
  display: grid;
  grid-template:
    'menuPanel contentPanel ' 1fr
    'menuPanel footerPanel ' auto
    / auto 1fr auto;
  width: 100vw;
  height: 100vh;
  background-color: #e2e2e2;
  position: fixed;
  top: 0;
  left: 0;
  padding: 0px;
  gap: 0px;
  box-sizing: border-box;
`;
export const ProfileContext = React.createContext({});
export const profileAtom = atom({
  key: "profileAtom",
  default: selector({
    key: "profileAtom/Default",
    get: async () => {
      try {
        const profile = JSON.parse(localStorage.getItem("Profile"));
        if (profile) {
          return profile;
        }
        const {data} = await axios.get("/api/loadProfile.php");
        localStorage.setItem("Profile", JSON.stringify(data.profile));
        return data.profile;
      } catch (error) {
        console.log("Error loading user profile", error.message);
        return {};
      }
    }
  })
});
export const toolViewAtom = atom({
  key: "toolViewAtom",
  default: {
    toolName: "Test",
    menuPanelTypes: ["TestControl", "ToastTest"],
    menuPanelsTitles: ["Test Control", "Toast"],
    menuPanelsInitOpen: [false, true],
    mainPanelType: "One",
    supportPanelTypes: ["Two", "One", "Count"],
    supportPanelTitles: ["Panel Two", "Panel One", "Count"],
    supportPanelIndex: 1
  }
});
let toolsObj = {
  test: {
    toolName: "Test",
    menuPanelTypes: ["TestControl", "ToastTest"],
    menuPanelsTitles: ["Test Control", "Toast"],
    menuPanelsInitOpen: [false, true],
    mainPanelType: "One",
    supportPanelTypes: ["Two", "One", "Count"],
    supportPanelTitles: ["Panel Two", "Panel One", "Count"],
    supportPanelIndex: 1
  },
  count: {
    toolName: "Count",
    menuPanelTypes: ["TestControl"],
    menuPanelsTitles: ["Test Control"],
    menuPanelsInitOpen: [true],
    mainPanelType: "Count",
    supportPanelTypes: ["Count2", "Count"],
    supportPanelTitles: ["Count Two", "Count One"],
    supportPanelIndex: 0
  },
  notfound: {
    toolName: "Notfound",
    menuPanelTypes: [],
    menuPanelsInitOpen: [],
    mainPanelType: "NotFound",
    supportPanelTypes: [],
    noMenuPanels: true
  }
};
let encodeParams = (p) => Object.entries(p).map((kv) => kv.map(encodeURIComponent).join("=")).join("&");
export default function ToolRoot(props) {
  const profile = useRecoilValueLoadable(profileAtom);
  const toolViewInfo = useRecoilValue(toolViewAtom);
  const mainPanelArray = useRef([]);
  const lastMainPanelKey = useRef(null);
  const mainPanelDictionary = useRef({});
  const supportPanelArray = useRef([]);
  const lastSupportPanelKey = useRef(null);
  const supportPanelDictionary = useRef({});
  const [menuPanelsOpen, setMenuPanelsOpen] = useState(true);
  const setView = useRecoilCallback(({set}) => (view, origPath) => {
    if (view === "") {
      location.href = `#test/`;
    } else {
      let newView = toolsObj[view];
      console.log(">>>newView", newView);
      if (!newView) {
        let newParams = {};
        newParams["path"] = `${origPath}`;
        const ePath = encodeParams(newParams);
        location.href = `#/notfound?${ePath}`;
      } else {
        set(toolViewAtom, newView);
      }
    }
  });
  const LazyObj = useRef({
    One: lazy(() => import("./ToolPanels/One.js")),
    Two: lazy(() => import("./ToolPanels/Two.js")),
    Count: lazy(() => import("./ToolPanels/Count.js")),
    Count2: lazy(() => import("./ToolPanels/Count2.js")),
    NotFound: lazy(() => import("./ToolPanels/NotFound.js"))
  }).current;
  if (profile.state === "loading") {
    return null;
  }
  if (profile.state === "hasError") {
    console.error(profile.contents);
    return null;
  }
  console.log(">>>===ToolRoot Route", props.route);
  function buildPanel({key, type, visible}) {
    let hideStyle = null;
    if (!visible) {
      hideStyle = "none";
    }
    return /* @__PURE__ */ React.createElement(Suspense, {
      key,
      fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, "loading...")
    }, React.createElement(LazyObj[type], {key, style: {display: hideStyle}}));
  }
  const lcpath = props.route.location.pathname.replaceAll("/", "").toLowerCase();
  if (toolViewInfo.toolName.toLowerCase() !== lcpath) {
    setView(lcpath, props.route.location.pathname);
    return null;
  }
  const MainPanelKey = `${toolViewInfo.toolName}-${toolViewInfo.mainPanelType}`;
  if (!mainPanelDictionary.current[MainPanelKey]) {
    mainPanelArray.current.push(buildPanel({key: MainPanelKey, type: toolViewInfo.mainPanelType, visible: true}));
    mainPanelDictionary.current[MainPanelKey] = {index: mainPanelArray.current.length - 1, type: toolViewInfo.mainPanelType, visible: true};
  }
  if (lastMainPanelKey.current !== null && lastMainPanelKey.current !== MainPanelKey) {
    const mpObj = mainPanelDictionary.current[MainPanelKey];
    const lastObj = mainPanelDictionary.current[lastMainPanelKey.current];
    if (!mpObj.visible) {
      mainPanelArray.current[mpObj.index] = buildPanel({key: MainPanelKey, type: mpObj.type, visible: true});
      mpObj.visible = true;
    }
    if (lastObj.visible) {
      mainPanelArray.current[lastObj.index] = buildPanel({key: lastMainPanelKey.current, type: lastObj.type, visible: false});
      lastObj.visible = false;
    }
  }
  lastMainPanelKey.current = MainPanelKey;
  let supportPanel = null;
  if (toolViewInfo.supportPanelTypes && toolViewInfo.supportPanelTypes.length > 0) {
    const SupportPanelKey = `${toolViewInfo.toolName}-${toolViewInfo.supportPanelTypes[toolViewInfo.supportPanelIndex]}-${toolViewInfo.supportPanelIndex}`;
    if (!supportPanelDictionary.current[SupportPanelKey]) {
      supportPanelArray.current.push(buildPanel({key: SupportPanelKey, type: toolViewInfo.supportPanelTypes[toolViewInfo.supportPanelIndex], visible: true}));
      supportPanelDictionary.current[SupportPanelKey] = {index: supportPanelArray.current.length - 1, type: toolViewInfo.supportPanelTypes[toolViewInfo.supportPanelIndex], visible: true};
    }
    if (lastSupportPanelKey.current !== null && lastSupportPanelKey.current !== SupportPanelKey) {
      const spObj = supportPanelDictionary.current[SupportPanelKey];
      const lastObj = supportPanelDictionary.current[lastSupportPanelKey.current];
      if (!spObj.visible) {
        supportPanelArray.current[spObj.index] = buildPanel({key: SupportPanelKey, type: spObj.type, visible: true});
        spObj.visible = true;
      }
      if (lastObj.visible) {
        supportPanelArray.current[lastObj.index] = buildPanel({key: lastSupportPanelKey.current, type: lastObj.type, visible: false});
        lastObj.visible = false;
      }
    }
    lastSupportPanelKey.current = SupportPanelKey;
    supportPanel = /* @__PURE__ */ React.createElement(SupportPanel, {
      panelTitles: toolViewInfo.supportPanelTitles,
      panelIndex: toolViewInfo.supportPanelIndex
    }, supportPanelArray.current);
  }
  let menuPanels = null;
  if (menuPanelsOpen && !toolViewInfo.noMenuPanels) {
    menuPanels = /* @__PURE__ */ React.createElement(MenuPanels, {
      setMenuPanelsOpen,
      panelTitles: toolViewInfo.menuPanelsTitles,
      panelTypes: toolViewInfo.menuPanelTypes,
      initOpen: toolViewInfo.menuPanelsInitOpen
    });
  }
  let profileInMainPanel = !menuPanelsOpen;
  if (toolViewInfo.noMenuPanels) {
    profileInMainPanel = false;
  }
  return /* @__PURE__ */ React.createElement(ProfileContext.Provider, {
    value: profile.contents
  }, /* @__PURE__ */ React.createElement(GlobalFont, null), /* @__PURE__ */ React.createElement(ToolContainer, null, menuPanels, /* @__PURE__ */ React.createElement(ContentPanel, {
    main: /* @__PURE__ */ React.createElement(MainPanel, {
      setMenuPanelsOpen,
      displayProfile: profileInMainPanel
    }, mainPanelArray.current),
    support: supportPanel
  })), /* @__PURE__ */ React.createElement(Toast, null));
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
const layerStackAtom = atom({
  key: "layerStackAtom",
  default: []
});
export const useStackId = () => {
  const getId = useRecoilCallback(({snapshot}) => () => {
    const currentId = snapshot.getLoadable(layerStackAtom);
    return currentId.getValue().length;
  });
  const [stackId] = useState(() => getId());
  return stackId;
};
