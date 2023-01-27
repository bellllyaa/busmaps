import React from "react";
import { useTheme } from '@mui/material/styles';

import isIPhone from "../../hooks/isIPhone";
import isAndroid from "../../hooks/isAndroid";

import "./InstructionsCard.css";
import IPhoneInstructions from "./Instructions/IPhoneInstructions";
import AndroidInstructions from "./Instructions/AndroidInstructions";

function InstructionsCard () {

  const theme = useTheme();

  const DisplayInstructions = () => {
    if (isIPhone()) {
      return (
        <IPhoneInstructions />
      )
    } else if (isAndroid()) {
      return (
        <AndroidInstructions />
      )
    }
  }

  return (
    <div
      className={`install-instructions__container${
        theme.palette.mode === "light" ? "" : "-theme-dark"
      }`}
    >
      <div
        className="install-instructions__background"
        onClick={() => {
          document.querySelector(
            `.install-instructions__container${
              theme.palette.mode === "light" ? "" : "-theme-dark"
            }`
          ).style.display = "none";
        }}
      ></div>
      <div className="install-instruction-card">
        <DisplayInstructions />
      </div>
    </div>
  );
}

export default InstructionsCard;