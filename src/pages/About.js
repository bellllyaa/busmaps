import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';

import "./About.css";
import arrowLeftIcon from "../assets/arrow-left.svg";
import goofyAhh from "../data/goofy_ahh.json";

function About () {

  const theme = useTheme();
  const navigate = useNavigate();
  const navigateTo = (url) => navigate(url);

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
    <div className={`about__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`}>
      <div className="about__nav">
        <button className="about-return-button" onClick={() => {navigateTo("/settings")}}>
          <img
            src={arrowLeftIcon}
            alt="Close menu button"
          />
        </button>
        <h1>O Aplikacji</h1>
      </div>
      <div className="about">
        <div className="about-element">
          <h3 className="large-screen">Autor: <a href="https://www.facebook.com/bellllyaa" target="_blank">Artem Balianowski</a></h3>
          <h3 className="small-screen">Autor: <a href="fb://profile/100010477600577" target="_blank">Artem Balianowski</a></h3>
        </div>
        <div className="about-element">
          <h3>Email: busmaps.pl@gmail.com</h3>
        </div>
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
                src={goofyAhh.fullHeight[Math.floor(Math.random() * 2)+24]}
                // alt="Goofy ahh image"
              ></img>
            ) : null}
    </div>
  )
}

export default About;