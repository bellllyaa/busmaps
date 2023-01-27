import React from "react";
import { useTheme } from '@mui/material/styles';

import isAndroidOpera from "../../../hooks/isAndroidOpera";
import isAndroidFirefox from "../../../hooks/isAndroidFirefox";

import "./AndroidInstructions.css";
import operaOptionsPic from "../../../assets/install-banner/android/opera-options.png";
import operaOptionsDarkPic from "../../../assets/install-banner/android/opera-options-dark.png";
import operaInstallAppPic from "../../../assets/install-banner/android/opera-install-app.jpg";
import operaInstallAppDarkPic from "../../../assets/install-banner/android/opera-install-app-dark.jpg";
import firefoxOptionsPic from "../../../assets/install-banner/android/firefox-options.png";
import firefoxOptionsDarkPic from "../../../assets/install-banner/android/firefox-options-dark.png";
import firefoxInstallAppPic from "../../../assets/install-banner/android/firefox-install-app.jpg";
import firefoxInstallAppDarkPic from "../../../assets/install-banner/android/firefox-install-app-dark.jpg";
import chromeOptionsPic from "../../../assets/install-banner/android/chrome-options.png";
import chromeOptionsDarkPic from "../../../assets/install-banner/android/chrome-options-dark.png";
import chromeInstallAppPic from "../../../assets/install-banner/android/chrome-install-app.jpeg";
import chromeInstallAppDarkPic from "../../../assets/install-banner/android/chrome-install-app-dark.jpeg";

function AndroidInstructions () {

  const theme = useTheme();

  if (isAndroidOpera()) {
    return (
      <div className="android-install-instructions">
        <h3>Zainstaluj BusMaps</h3>
        <h3>Krok 1</h3>
        <div className="android-install-instructions-options-pic">
          <img
            src={
              theme.palette.mode === "light"
                ? operaOptionsPic
                : operaOptionsDarkPic
            }
            alt="Opera options button"
          />
        </div>
        <h3>Krok 2</h3>
        <div className="android-install-instructions-install-app-pic">
          <img
            src={
              theme.palette.mode === "light"
                ? operaInstallAppPic
                : operaInstallAppDarkPic
            }
            alt="Opera install app button"
          />
        </div>
      </div>
    )
  } else if (isAndroidFirefox()) {
    return (
      <div className="android-install-instructions">
        <h3>Zainstaluj BusMaps</h3>
        <h3>Krok 1</h3>
        <div className="android-install-instructions-options-pic">
          <img
            src={
              theme.palette.mode === "light"
                ? firefoxOptionsPic
                : firefoxOptionsDarkPic
            }
            alt="Firefox options button"
          />
        </div>
        <h3>Krok 2</h3>
        <div className="android-install-instructions-install-app-pic">
          <img
            src={
              theme.palette.mode === "light"
                ? firefoxInstallAppPic
                : firefoxInstallAppDarkPic
            }
            alt="Firefox install app button"
          />
        </div>
      </div>
    )
  } else {
    return (
      <div className="android-install-instructions">
        <h3>Zainstaluj BusMaps</h3>
        <h3>Krok 1</h3>
        <p>
          Otwórz{" "}
          <a href="https://busmaps.pl" target="_blank" rel="noreferrer">
            busmaps.pl
          </a>{" "}
          w Chrome/Opera/Firefox
        </p>
        <h3>Krok 2</h3>
        <div className="android-install-instructions-options-pic">
          <img
            src={
              theme.palette.mode === "light"
                ? chromeOptionsPic
                : chromeOptionsDarkPic
            }
            alt="Chrome options button"
          />
        </div>
        <h3>Krok 3</h3>
        <div className="android-install-instructions-install-app-pic">
          <img
            src={
              theme.palette.mode === "light"
                ? chromeInstallAppPic
                : chromeInstallAppDarkPic
            }
            alt="Chrome install app button"
          />
        </div>
      </div>
    );
  }
}

export default AndroidInstructions;