import React, {useContext} from "../_snowpack/pkg/react.js";
import styled from "../_snowpack/pkg/styled-components.js";
import {ProfileContext} from "./NewToolRoot.js";
const ProfilePicture = styled.button`
background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
  url('/media/profile_pictures/${(props) => props.pic}.jpg');
background-position: center;
background-repeat: no-repeat;
background-size: cover;
transition: 300ms;
// color: #333333;
width: 30px;
height: 30px;
display: inline-block;
// color: rgba(0, 0, 0, 0);
justify-content: center;
align-items: center;
border-radius: 50%;
border-style: none;
margin-left: 75px;
margin-top: 4px
`;
export default function Profile() {
  const profile = useContext(ProfileContext);
  const profilePicName = profile.profilePicture;
  return /* @__PURE__ */ React.createElement(ProfilePicture, {
    pic: profilePicName,
    onClick: () => console.log(">>>view profile")
  });
}
