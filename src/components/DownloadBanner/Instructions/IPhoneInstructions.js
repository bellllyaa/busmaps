import React from "react";
import { useTheme } from '@mui/material/styles';

import isSafari from "../../../hooks/isSafari";

import "./IPhoneInstructions.css";
import iosLaunchSafariButtonPic from "../../../assets/ios-launch-safari.jpg";
import iosShareButtonPic from "../../../assets/ios-share-button.png";
import iosShareButtonDarkPic from "../../../assets/ios-share-button-dark.png";
import iosAddToHomeScreenButtonPic from "../../../assets/ios-add-to-home-screen.jpeg";
import iosAddToHomeScreenButtonDarkPic from "../../../assets/ios-add-to-home-screen-dark.jpeg";

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
        <h3>Dodaj do ekranu początkowego</h3>
        {isSafari() ? null : (
          <>
            <h3>Krok 1</h3>
            <p>Odtwórz <a href="safari-https://busmaps.pl">busmaps.pl</a> w Safari</p>
            <div className="iphone-install-instructions-lauch-safari-pic">
              <img
                src={iosLaunchSafariButtonPic}
                alt="iOS share button image"
              />
            </div>
          </>
        )}
        <h3>{`Krok ${isSafari() ? "1" : "2"}`}</h3>
        <div className="iphone-install-instructions-share-button-pic">
          <img
            src={theme.palette.mode === "light" ? iosShareButtonPic : iosShareButtonDarkPic}
            alt="iOS share button image"
          />
        </div>
        <h3>{`Krok ${isSafari() ? "2" : "3"}`}</h3>
        <div className="iphone-install-instructions-add-to-home-screen-button-pic">
          <img
            src={theme.palette.mode === "light" ? iosAddToHomeScreenButtonPic : iosAddToHomeScreenButtonDarkPic}
            alt="iOS share button image"
          />
        </div>
      </div>
    </div>
  );
}

export default IPhoneInstructions;