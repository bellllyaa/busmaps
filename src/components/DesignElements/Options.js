import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';

import "./Options.css";

// Icons
import settingsIcon from "../../assets/settings.svg";
import settingsDarkIcon from "../../assets/settings-dark.svg";
import reportAnIssueIcon from "../../assets/report-an-issue.svg";
import reportAnIssueDarkIcon from "../../assets/report-an-issue-dark.svg";
import starIcon from "../../assets/star.svg";
import starDarkIcon from "../../assets/star-dark.svg";
import starCrossedIcon from "../../assets/star-crossed.svg";
import starCrossedDarkIcon from "../../assets/star-crossed-dark.svg";

const Options = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const navigateTo = (url) => navigate(url);

  const isFavorite = () => {
    const lastOpenedStops = JSON.parse(localStorage.getItem("lastOpenedStops"));
    const favoriteStops = JSON.parse(localStorage.getItem("favoriteStops"));

    if (favoriteStops === null || lastOpenedStops === null) {
      return false;
    }

    for (const stop of favoriteStops) {
      if (stop.stopId === lastOpenedStops[0].stopId && stop.stopName === lastOpenedStops[0].stopName) {
        return true;
      }
    }

    return false;
  }

  return (
    <div
      className={`options__container${
        theme.palette.mode === "light" ? "" : "-theme-dark"
      }`}
    >
      <div
        className="options__background"
        onClick={() => {
          // document.querySelector("#show-options-button").style.backgroundColor = "#bbbbbb";
          // setTimeout(() => {
          //   document.querySelector("#show-options-button").style.backgroundColor = "#e9e9e9";
          // }, 100)
          document
            .querySelector(
              `.upper-part__container${
                theme.palette.mode === "light" ? "" : "-theme-dark"
              }`
            )
            .querySelector("#show-options-button")
            .click();
        }}
      ></div>
      <ul className="options">
        <li>
          <button
            className="option first"
            onClick={() => {
              navigateTo("/settings");
            }}
          >
            <p>Ustawienia</p>
            <img
              src={
                theme.palette.mode === "light" ? settingsIcon : settingsDarkIcon
              }
              alt="Settings button"
            />
          </button>
        </li>
        <li>
          <button
            className="option"
            onClick={() => {
              navigateTo("/report-a-problem");
            }}
          >
            <p>Zgłosić błąd</p>
            <img
              src={
                theme.palette.mode === "light"
                  ? reportAnIssueIcon
                  : reportAnIssueDarkIcon
              }
              alt="Report an issue button"
            />
          </button>
        </li>
        <li style={{ height: "5px", borderTop: "none" }}>
          <div className="options__divider"></div>
        </li>
        <li style={{ borderTop: "none" }}>
          {isFavorite() ? (
            <button
            className="option last"
            onClick={() => {
              // window.alert("Jeszcze nie działa")
              const lastOpenedStops = JSON.parse(
                localStorage.getItem("lastOpenedStops")
              );
              const favoriteStops = JSON.parse(
                localStorage.getItem("favoriteStops")
              );
              for (const stop of favoriteStops) {
                if (stop.stopId === lastOpenedStops[0].stopId && stop.stopName === lastOpenedStops[0].stopName) {
                  const index = favoriteStops.indexOf(stop);
                  favoriteStops.splice(index, 1);
                  break;
                }
              }
              if (favoriteStops.length === 0) {
                localStorage.removeItem("favoriteStops")
              } else {
                localStorage.setItem("favoriteStops", JSON.stringify(favoriteStops));
              }
              console.log(JSON.parse(localStorage.getItem("favoriteStops")));
              document
                .querySelector(
                  `.upper-part__container${
                    theme.palette.mode === "light" ? "" : "-theme-dark"
                  }`
                )
                .querySelector("#show-options-button")
                .click();
              // window.alert("Dodano")
            }}
          >
            <p>Usunąć z polubionych</p>
            <img
              src={theme.palette.mode === "light" ? starCrossedIcon : starCrossedDarkIcon}
              alt="Remove from favorites button"
            />
          </button>
          ) : (
            <button
              className="option last"
              onClick={() => {
                // window.alert("Jeszcze nie działa")
                const lastOpenedStops = JSON.parse(
                  localStorage.getItem("lastOpenedStops")
                );
                let favoriteStops = JSON.parse(
                  localStorage.getItem("favoriteStops")
                );
                if (lastOpenedStops === null) {
                  window.alert("Nie udało się:(");
                  return;
                }
                if (favoriteStops === null) {
                  favoriteStops = [lastOpenedStops[0]];
                } else {
                  favoriteStops.push(lastOpenedStops[0]);
                }
                localStorage.setItem(
                  "favoriteStops",
                  JSON.stringify(favoriteStops)
                );
                console.log(JSON.parse(localStorage.getItem("favoriteStops")));
                document
                  .querySelector(
                    `.upper-part__container${
                      theme.palette.mode === "light" ? "" : "-theme-dark"
                    }`
                  )
                  .querySelector("#show-options-button")
                  .click();
                // window.alert("Dodano")
              }}
            >
              <p>Dodać do polubionych</p>
              <img
                src={theme.palette.mode === "light" ? starIcon : starDarkIcon}
                alt="Add to favorites button"
              />
            </button>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Options;
