import React from 'react';
import { doenetComponentForegroundInactive } from "./theme"

export default function Textfield(props) {
  //Assume small
  var textfield = {
        margin: '0px',
        height: '24px',
        border: `2px solid ${doenetComponentForegroundInactive}`,
        fontFamily: 'Arial',
        borderRadius: '5px',
        color: '#000',
        value: 'Enter text here'
      }
  if (props.value) {
    textfield.value = props.value;
}
if (props.width) {
  if (props.width === "menu") {
    textfield.width = '235px'
  } 
}
function handleChange(e) {
  if (props.onChange) props.onChange(e.target.value)
}

    return (
        <>
            <textarea defaultValue={textfield.value} style={textfield} onChange={(e) => { handleChange(e) }}></textarea>
        </>
    )
}