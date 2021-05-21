import React, {useState, useRef} from "../_snowpack/pkg/react.js";
import {
  atom,
  RecoilRoot,
  useSetRecoilState,
  useRecoilState,
  useRecoilValue,
  selector,
  atomFamily,
  selectorFamily,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilCallback
} from "../_snowpack/pkg/recoil.js";
import styled from "../_snowpack/pkg/styled-components.js";
import Tool from "../_framework/Tool.js";
import {useToolControlHelper} from "../_framework/ToolRoot.js";
import "../_framework/doenet.css.proxy.js";
import Textinput from "../_framework/Textinput.js";
import Switch from "../_framework/Switch.js";
import Cookies from "../_snowpack/pkg/js-cookie.js";
import axios from "../_snowpack/pkg/axios.js";
let SectionHeader = styled.h2`
  margin-top: 2em;
  margin-bottom: 2em;
`;
let ProfilePicture = styled.button`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url("/media/profile_pictures/${(props) => props.pic}.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 5em;
  height: 5em;
  color: rgba(0, 0, 0, 0);
  font-size: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 100px;
  border-radius: 50%;
  border-style:none;
  user-select: none;
  &:hover, &:focus {
    background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
      url("/media/profile_pictures/${(props) => props.pic}.jpg");
    color: rgba(255, 255, 255, 1);
  }
`;
const PictureBox = styled.button`
  width: 40px;
  height: 40px;
  background-image: url("/media/profile_pictures/${(props) => props.pic}.jpg");
  background-size: contain;
  margin: 3px;
  border: none;
  border-radius: 3px;
`;
const DropDown = styled.div`
  text-align: right;
  width: 150px;
  z-index: 2;
  position: absolute;
  margin-right: 100px;
`;
const ListContainer = styled.ul`
  /* max-width: 80px; */
  padding: 4px;
  list-style-type: none;
  /* border: 1px solid #505050; */
  border-radius: 3px;
  box-shadow: 3px 3px 7px #888888;
  background: #ffffff;
  margin: 0 auto;
  text-align: left;
`;
const ListItem = styled.li`
  display: inline-block;
  vertical-align: top;
`;
const PROFILE_PICTURES = ["anonymous", "bird", "cat", "dog", "emu", "fox", "horse", "penguin", "quokka", "squirrel", "swan", "tiger", "turtle"];
const getProfileQuerry = atom({
  key: "getProfileQuerry",
  default: selector({
    key: "getProfileQuerry/Default",
    get: async () => {
      try {
        const {data} = await axios.get("/api/loadProfile.php");
        return data.profile;
      } catch (error) {
        console.log("Error loading user profile", error.message);
        return {};
      }
    }
  })
});
const PictureSelector = (props) => {
  var list = props.list.map((item, i) => /* @__PURE__ */ React.createElement(ListItem, {
    key: i
  }, /* @__PURE__ */ React.createElement(PictureBox, {
    value: item,
    pic: item,
    onClick: (e) => {
      props.callBack(e.target.value);
    }
  })));
  return /* @__PURE__ */ React.createElement(DropDown, {
    onBlur: props.onblur
  }, /* @__PURE__ */ React.createElement(ListContainer, null, list));
};
const getProfile = selector({
  key: "getProfile",
  get: ({get}) => {
    let data = get(getProfileQuerry);
    return data;
  }
});
const boolToString = (bool) => {
  if (bool) {
    return "1";
  } else {
    return "0";
  }
};
export default function DoenetProfile(props) {
  const setProfile = useRecoilCallback(({set}) => async (newProfile) => {
    const url = "/api/saveProfile.php";
    const data = {
      ...newProfile
    };
    set(getProfileQuerry, data);
    await axios.post(url, data);
  });
  let profile = useRecoilValueLoadable(getProfile);
  let [expand, setExpand] = useState(false);
  return /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("headerPanel", {
    title: "Account Settings"
  }), profile.state == "hasValue" ? /* @__PURE__ */ React.createElement("mainPanel", null, /* @__PURE__ */ React.createElement("div", {
    style: {margin: "auto", width: "70%"}
  }, /* @__PURE__ */ React.createElement("div", {
    style: {margin: "auto", width: "fit-content", marginTop: "20px"}
  }, /* @__PURE__ */ React.createElement(ProfilePicture, {
    pic: profile.contents.profilePicture,
    onClick: (e) => {
      setExpand(!expand);
    },
    name: "changeProfilePicture",
    id: "changeProfilePicture"
  }), expand ? /* @__PURE__ */ React.createElement("div", {
    style: {}
  }, /* @__PURE__ */ React.createElement(PictureSelector, {
    onblur: (e) => {
      setExpand(false);
    },
    list: PROFILE_PICTURES,
    callBack: (newPicture) => {
      let data = {...profile.contents};
      data.profilePicture = newPicture;
      setProfile(data);
    }
  })) : null, /* @__PURE__ */ React.createElement(Textinput, {
    style: {width: "300px"},
    id: "screen name",
    label: "Screen Name",
    value: profile.contents.screenName,
    onChange: (e) => {
    },
    onBlur: (e) => {
      let data = {...profile.contents};
      data.screenName = e.target.value;
      setProfile(data);
    },
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        let data = {...profile.contents};
        data.screenName = e.target.value;
        setProfile(data);
      }
    }
  }), /* @__PURE__ */ React.createElement(Textinput, {
    style: {width: "300px"},
    id: "firstName",
    label: "First Name",
    value: profile.contents.firstName,
    onChange: (e) => {
    },
    onBlur: (e) => {
      let data = {...profile.contents};
      data.firstName = e.target.value;
      setProfile(data);
    },
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        let data = {...profile.contents};
        data.screenName = e.target.value;
        setProfile(data);
      }
    }
  }), /* @__PURE__ */ React.createElement(Textinput, {
    style: {width: "300px"},
    id: "lastName",
    label: "Last Name",
    value: profile.contents.lastName,
    onChange: (e) => {
    },
    onBlur: (e) => {
      let data = {...profile.contents};
      data.lastName = e.target.value;
      setProfile(data);
    },
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        let data = {...profile.contents};
        data.screenName = e.target.value;
        setProfile(data);
      }
    }
  })), /* @__PURE__ */ React.createElement("p", null, "Email Address: ", profile.contents.email), /* @__PURE__ */ React.createElement(Switch, {
    id: "trackingConsent",
    onChange: (e) => {
      let data = {...profile.contents};
      data.trackingConsent = boolToString(e.target.checked);
      setProfile(data);
    },
    checked: profile.contents.trackingConsent
  }), /* @__PURE__ */ React.createElement("p", null, "I consent to the use of tracking technologies."), /* @__PURE__ */ React.createElement("p", null, '"I consent to the tracking of my progress and my activity on educational websites which participate in Doenet; my data will be used to provide my instructor with my grades on course assignments, and anonymous data may be provided to content authors to improve the educational effectiveness."', /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("em", null, "Revoking your consent may impact your ability to recieve credit for coursework.")), /* @__PURE__ */ React.createElement(SectionHeader, null, "Your Roles"), /* @__PURE__ */ React.createElement(Switch, {
    id: "student",
    onChange: (e) => {
      let data = {...profile.contents};
      data.roleStudent = boolToString(e.target.checked);
      setProfile(data);
    },
    checked: profile.contents.roleStudent
  }), /* @__PURE__ */ React.createElement("p", null, "Student"), /* @__PURE__ */ React.createElement(Switch, {
    id: "instructor",
    onChange: (e) => {
      let data = {...profile.contents};
      data.roleInstructor = boolToString(e.target.checked);
      setProfile(data);
    },
    checked: profile.contents.roleInstructor
  }), /* @__PURE__ */ React.createElement("p", null, "Instructor"), /* @__PURE__ */ React.createElement(Switch, {
    id: "course_designer",
    onChange: (e) => {
      let data = {...profile.contents};
      data.roleCourseDesigner = boolToString(e.target.checked);
      setProfile(data);
    },
    checked: profile.contents.roleCourseDesigner
  }), /* @__PURE__ */ React.createElement("p", null, "Course Designer"))) : /* @__PURE__ */ React.createElement("p", null, "Loading..."));
}
