import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';

import isStandalone from "../../hooks/isStandalone";
import isIPhone from "../../hooks/isIPhone";
import isAndroid from "../../hooks/isAndroid";

import "./DownloadBanner.css";
import xSymbolIcon from "../../assets/x-symbol.svg";
import busIcon from "../../assets/bus.svg";
import busDarkIcon from "../../assets/bus-dark.svg";
import InstructionsCard from "./InstructionsCard";

// sessionStorage.removeItem("downloadBannerVisibility");

// window.alert(window.matchMedia('(display-mode: standalone)').matches)
// console.log(window.navigator)

// const isIPhone = () => {
//   if (window.navigator.userAgent.indexOf('iPhone') != -1 || window.navigator.userAgent.indexOf('iPad') != -1) {
//     // window.alert("true")
//     return true
//   } else {
//     return false
//   }
// }

// const isSafari = () => {
//   return /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
// }

// const isOpera = () => {
//   return typeof window.opr !== "undefined";
// }

// const isChrome = () => {
//   return window.chrome !== null && window.chrome !== undefined && window.navigator.vendor === "Google Inc." && !isIOSOpera();
// }

function DownloadBanner() {

  const theme = useTheme();
  const [downloadBannerVisibility, setDownloadBannerVisibility] = useState(!isStandalone() && sessionStorage.getItem("downloadBannerVisibility") !== "false" && (isIPhone() || isAndroid()));
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  
  // const isChrome = () => {
  //   return !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
  // }

  const installApp = () => {
    // window.alert("installing...")
    if (deferredPrompt !== null) {
      try {
        deferredPrompt.prompt()
          .then(() => {
            setDeferredPrompt(null);
            setDownloadBannerVisibility(false);
          })
          .catch((err) => {
            window.alert(err);
          })
      } catch (err) {
        window.alert("Failed to install through deferredPrompt");
        window.alert(err);
      }
    } else if (isIPhone()) {
      document.querySelector(`.install-instructions__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`).style.display = "block";
    } else if (isAndroid()) {
      document.querySelector(`.install-instructions__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`).style.display = "block";
    }
  }

  // useEffect(() => {
  //   if (downloadBannerVisibility) {
  //     window.addEventListener('beforeinstallprompt', (e) => {
  //       // Prevent the mini-infobar from appearing on mobile
  //       e.preventDefault();
  //       // Stash the event so it can be triggered later.
  //       setDeferredPrompt(e);
  //       localStorage.setItem("beforeinstallprompt", JSON.stringify(e));
  //       // Update UI notify the user they can install the PWA
  //       // showInstallPromotion();
  //       // Optionally, send analytics event that PWA install promo was shown.
  //       // console.log(`'beforeinstallprompt' event was fired.`);
  //       window.alert(`'beforeinstallprompt' event was fired.`);
  //     });
  //   }
  // }, [])

  useEffect(() => {
    if (downloadBannerVisibility) {
      try {
        document.querySelector(".search-bar__container").style.top = "50px";
      } catch {}
    } else {
      sessionStorage.setItem("downloadBannerVisibility", "false");
      document.querySelector(".search-bar__container").style.top = "0";
    }

    // if (window.navigator.standalone !== true && downloadBannerVisibility) {
    //   console.log(downloadBannerVisibility);
    // }
  }, [downloadBannerVisibility])

  return (
    <>
      {downloadBannerVisibility ? (
        <div className={`download-banner__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`}>
          <div className="download-banner-close-button">
            <button
              onClick={() => {
                setDownloadBannerVisibility(false);
              }}
            >
              <img src={xSymbolIcon} alt="Close banner button" />
            </button>
          </div>
          <div className="download-banner-app-icon">
            <img
              src={theme.palette.mode === "light" ? busIcon : busDarkIcon}
              alt="Stop icon"
            ></img>
          </div>
          <div className="download-banner-app-name">
            <div>BusMaps</div>
            <div>Dodaj do ekranu początkowego</div>
          </div>
          <div className="download-banner-install-button">
            <button
              onClick={() => {
                installApp();
              }}
            >
              <b>ZAINSTALUJ</b>
            </button>
          </div>
        </div>
      ) : null}
      <InstructionsCard />
    </>
  );
}

export default DownloadBanner;