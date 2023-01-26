import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';

import isIPhone from "../../hooks/isIPhone";
import isSafari from "../../hooks/isSafari";
import isOpera from "../../hooks/isOpera";

import "./DownloadBanner.css";
import xSymbolIcon from "../../assets/x-symbol.svg";
import busIcon from "../../assets/bus.svg";
import busDarkIcon from "../../assets/bus-dark.svg";
import IPhoneInstructions from "./Instructions/IPhoneInstructions";

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

const isChrome = () => {
  return window.chrome !== null && window.chrome !== undefined && window.navigator.vendor === "Google Inc." && !isOpera();
}

function DownloadBanner() {

  const theme = useTheme();
  const [downloadBannerVisibility, setDownloadBannerVisibility] = useState(!(window.navigator.standalone === true || (window && window.matchMedia('(display-mode: standalone)').matches)) && sessionStorage.getItem("downloadBannerVisibility") !== "false" && isIPhone() || true);
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
    } else if (isIPhone() && isSafari()) {
      // window.alert(isChrome());
      document.querySelector(`.iphone-install-instructions__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`).style.display = "block";
      // document.querySelector(`.iphone-install-instructions__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`).style.visibility = "visible";
    } else {
      document.querySelector(`.iphone-install-instructions__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`).style.display = "block";
      // document.querySelector(`.iphone-install-instructions__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`).style.visibility = "visible";
    }
  }

  useEffect(() => {
    if (downloadBannerVisibility && false) {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        setDeferredPrompt(e);
        localStorage.setItem("beforeinstallprompt", JSON.stringify(e));
        // Update UI notify the user they can install the PWA
        // showInstallPromotion();
        // Optionally, send analytics event that PWA install promo was shown.
        // console.log(`'beforeinstallprompt' event was fired.`);
        window.alert(`'beforeinstallprompt' event was fired.`);
      });
    }
  }, [])

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
              ZAINSTALUJ
            </button>
          </div>
        </div>
      ) : null}
      <IPhoneInstructions />
    </>
  );
}

export default DownloadBanner;