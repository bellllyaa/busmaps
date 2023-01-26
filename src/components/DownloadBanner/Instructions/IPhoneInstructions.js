import React from "react";
import { useTheme } from '@mui/material/styles';

import "./IPhoneInstructions.css";
import iosShareButtonPic from "../../../assets/ios-share-button.png";

function IPhoneInstructions () {

  const theme = useTheme();

  return (
    <div
      className={`iphone-install-instructions__container${
        theme.palette.mode === "light" ? "" : "-theme-dark"
      }`}
    >
      <div
        className="iphone-install-instructions__background"
        onClick={() => {
          // document.querySelector(`.iphone-install-instructions__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`).style.visibility = "hidden";
          document.querySelector(
            `.iphone-install-instructions__container${
              theme.palette.mode === "light" ? "" : "-theme-dark"
            }`
          ).style.display = "none";
        }}
      ></div>
      <div className="iphone-install-instructions">
        <h3>Dodaj do ekranu początkującego</h3>
        <div className="iphone-install-instructions-share-button-pic">
          <img
            src={iosShareButtonPic}
            alt="iOS share button image"
          />
        </div>
      </div>
    </div>
  );
}

export default IPhoneInstructions;