import React from "../../_snowpack/pkg/react.js";
import {profileToolViewStashAtom} from "../Profile.js";
import {useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import {toolViewAtom} from "../NewToolRoot.js";
export default function CloseProfileButton(props) {
  const closeProfile = useRecoilCallback(({set, snapshot}) => async () => {
    let stash = await snapshot.getPromise(profileToolViewStashAtom);
    let newStash = {...stash};
    set(toolViewAtom, newStash);
  });
  return /* @__PURE__ */ React.createElement("button", {
    onClick: () => closeProfile()
  }, "Close");
}
