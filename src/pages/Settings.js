import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';

import "./Settings.css";
import arrowLeftIcon from "../assets/arrow-left.svg";
import goofyAhh from "../data/goofy_ahh.json";

const Settings = () => {

  const theme = useTheme();
  const navigate = useNavigate();
  const navigateTo = (url) => navigate(url);
  // theme.palette.mode === "light"

  useEffect(() => {
    try {
      if (theme.palette.mode === "light") {
        document.querySelectorAll('meta[name="theme-color"]')[0].setAttribute('content', "#ffffff");
      } else {
        document.querySelectorAll('meta[name="theme-color"]')[1].setAttribute('content', "#000000");
      }
    } catch {}
  }, [])

  return (
    <div
      className={`settings__container${
        theme.palette.mode === "light" ? "" : "-theme-dark"
      }`}
    >
      <div className="settings__nav">
        <button
          className="settings-return-button"
          onClick={() => {
            navigateTo("/");
          }}
        >
          <img src={arrowLeftIcon} alt="Close menu button" />
        </button>
        <h1>Ustawienia</h1>
      </div>
      
      <div className="settings">
        <div className="settings-element">
          <h3
            /*style={{ color: "#0a84fe" }}*/
            onClick={() => {
              navigateTo("/about");
            }}
          >
            O Aplikacji
          </h3>
        </div>
        {localStorage.getItem("mode") === "ohio" ? (
          <div className="settings-element">
            <h3 onClick={() => {localStorage.removeItem("mode"); navigateTo("/settings");}}>Wyłączyć tryb Ohio</h3>
          </div>
        ) : null}
      </div>
      {localStorage.getItem("mode") === "ohio" ? (
              <img
                style={{
                  width: "100%",
                  height: "calc(100% + 30px)",
                  position: "absolute",
                  left: "0",
                  top: "-20px",
                  zIndex: "1",
                  opacity: theme.palette.mode === "light" ? "0.2" : "0.2",
                  pointerEvents: "none"
                }}
                src={goofyAhh.fullHeight[1]}
                // alt="Goofy ahh image"
              ></img>
            ) : null}
    </div>
  );
}

export default Settings;