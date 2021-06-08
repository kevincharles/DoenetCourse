import React, {useState, useRef, useEffect} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {
  atomFamily,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faGripLinesVertical} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {useStackId} from "../ToolRoot.js";
import {clearDriveAndItemSelections} from "../../_reactComponents/Drive/Drive.js";
const Wrapper = styled.div`
  grid-area: contentPanel;
  display: grid;
  grid-template:
    'mainControls handle supportControls' ${({$hasRespCont}) => $hasRespCont ? 40 : 0}px
    'mainPanel handle supportPanel' 1fr
    / ${({$proportion}) => `${$proportion}fr auto ${1 - $proportion}fr`};
  overflow: hidden;
  border-radius: 4px;
`;
const DragHandle = styled.div`
  grid-area: handle;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: hsl(0, 0%, 99%);
  padding: 0;
  cursor: ew-resize;
  background-color: hsl(0, 0%, 29%);
  width: 8px;
  box-sizing: border-box;
`;
const panelsInfoAtom = atomFamily({
  key: "panelsInfoAtom",
  default: {propotion: 0.5, isActive: false}
});
const panelPropotion = selectorFamily({
  key: "panelPropotion",
  get: (id) => ({get}) => {
    const info = get(panelsInfoAtom(id));
    return info.isActive ? info.propotion : 1;
  }
});
const calcInfo = (num) => num < 0.05 ? 0 : num < 0.1 ? 0.1 : num > 0.95 ? 1 : num > 0.9 ? 0.9 : num;
export const useSupportDividerController = () => {
  const stackId = useStackId();
  const supportController = useRecoilCallback(({set}) => (newIsActive, newProportion) => {
    set(panelsInfoAtom(stackId), (oldInfo) => ({
      isActive: newProportion === 1 ? false : newIsActive ?? !oldInfo.isActive,
      propotion: (newProportion ?? 1) === 1 ? oldInfo.propotion : calcInfo(newProportion)
    }));
  }, [stackId]);
  return supportController;
};
export default function ContentPanel({main, support}) {
  const wrapperRef = useRef();
  const [hasRespCont, setHasRespCont] = useState(false);
  const stackId = useStackId();
  const setDivider = useSupportDividerController();
  const panelProportion = useRecoilValue(panelPropotion(stackId));
  const clearDriveSelections = useSetRecoilState(clearDriveAndItemSelections);
  useEffect(() => {
    setDivider(support?.props.isInitOpen ?? false);
  }, [support?.props.isInitOpen, setDivider]);
  useEffect(() => {
    wrapperRef.current.style.gridTemplate = null;
  }, [panelProportion]);
  useEffect(() => {
    setHasRespCont((support?.props.responsiveControls || main?.props.responsiveControls) ?? false);
  }, [support?.props.responsiveControls, main?.props.responsiveControls]);
  useEffect(() => {
    wrapperRef.current.handleClicked = false;
    wrapperRef.current.handleDragged = false;
  }, []);
  const onMouseDown = (event) => {
    event.preventDefault();
    wrapperRef.current.handleClicked = true;
  };
  const onMouseMove = (event) => {
    if (wrapperRef.current.handleClicked) {
      event.preventDefault();
      wrapperRef.current.handleDragged = true;
      let proportion = calcInfo((event.clientX - wrapperRef.current.offsetLeft) / wrapperRef.current.clientWidth);
      wrapperRef.current.style.gridTemplateColumns = `${proportion}fr auto ${1 - proportion}fr`;
      wrapperRef.current.proportion = proportion;
    }
  };
  const onMouseUp = () => {
    if (wrapperRef.current.handleClicked) {
      wrapperRef.current.handleClicked = false;
      if (wrapperRef.current.handleDragged) {
        wrapperRef.current.handleDragged = false;
        setDivider(true, wrapperRef.current.proportion);
      } else {
        setDivider();
      }
    }
  };
  return /* @__PURE__ */ React.createElement(Wrapper, {
    onMouseUp,
    onMouseMove,
    onMouseLeave: onMouseUp,
    ref: wrapperRef,
    onClick: clearDriveSelections,
    $hasRespCont: hasRespCont,
    $proportion: panelProportion
  }, main, support ? /* @__PURE__ */ React.createElement(DragHandle, {
    onMouseDown,
    "data-cy": "contentPanelDragHandle",
    key: `SupportHandle${stackId}`
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faGripLinesVertical
  })) : null, support);
}
