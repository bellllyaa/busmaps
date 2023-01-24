import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';

import "./About.css";
import arrowLeftIcon from "../assets/arrow-left.svg";

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
    </div>
  )
}

export default About;