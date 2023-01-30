import React, { useEffect } from "react";
import { useTheme } from '@mui/material/styles';

import "./MapboxButtons.css";
import geolocationControlOffIcon from "../../../assets/map-custom-controls/geolocation-control-off.svg";
import geolocationControlOffDarkIcon from "../../../assets/map-custom-controls/geolocation-control-off-dark.svg";
import geolocationControlIcon from "../../../assets/map-custom-controls/geolocation-control.svg";
import geolocationControlDarkIcon from "../../../assets/map-custom-controls/geolocation-control-dark.svg";
import geolocationControlActiveIcon from "../../../assets/map-custom-controls/geolocation-control-active.svg";
import geolocationControlDisabledIcon from "../../../assets/map-custom-controls/geolocation-control-disabled.svg";
import iosSpinnerIcon from "../../../assets/ios-spinner.svg";
import compassIcon from "../../../assets/map-custom-controls/compass.svg";
import compassDarkIcon from "../../../assets/map-custom-controls/compass-dark.svg";

function MapboxButtons () {

  const theme = useTheme();

  useEffect(() => {
    function callback(mutationList, observer) {
      mutationList.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          // handle class change
          // console.log(geolocateBtn.classList);
          // console.log(mutationList);

          const geolocateBtn = document.querySelector('button[aria-label="Find my location"]');

          if (document.querySelector('button[aria-label="Location not available"]') !== null) {
            document.querySelector(".mapboxgl-ctrl-geolocate-custom-button").querySelector("img").setAttribute("src", geolocationControlDisabledIcon);
          } else if (geolocateBtn.classList.length === 1) {
            document.querySelector(".mapboxgl-ctrl-geolocate-custom-button").querySelector("img").setAttribute("src", theme.palette.mode === "light" ? geolocationControlOffIcon : geolocationControlOffDarkIcon);
          } else if (geolocateBtn.classList[1] === "mapboxgl-ctrl-geolocate-active") {
            document.querySelector(".mapboxgl-ctrl-geolocate-custom-button").querySelector("img").setAttribute("src", geolocationControlActiveIcon);
          } else if (geolocateBtn.classList[1] === "mapboxgl-ctrl-geolocate-background") {
            document.querySelector(".mapboxgl-ctrl-geolocate-custom-button").querySelector("img").setAttribute("src", theme.palette.mode === "light" ? geolocationControlIcon : geolocationControlDarkIcon);
          } else if (geolocateBtn.classList[1] === "mapboxgl-ctrl-geolocate-waiting") {
            const btnImg = document.querySelector(".mapboxgl-ctrl-geolocate-custom-button").querySelector("img");
            btnImg.setAttribute("src", iosSpinnerIcon);
            // btnImg.style.height = "15px";
            // btnImg.style.width = "15px";
          }
        }
      })
    }

    const observer = new MutationObserver(callback);
    const interval = setInterval(() => {
      if (document.querySelector('button[aria-label="Find my location"]') !== null) {
        observer.observe(document.querySelector('button[aria-label="Find my location"]'), {attributes: true});
        clearInterval(interval)
      } else if (document.querySelector('button[aria-label="Location not available"]') !== null) {
        document.querySelector(".mapboxgl-ctrl-geolocate-custom-button").querySelector("img").setAttribute("src", geolocationControlDisabledIcon);
        clearInterval(interval);
      }
    }, 100);
  }, [])

  useEffect(() => {
    function callback(mutationList, observer) {
      mutationList.forEach(function(mutation) {
        if(mutation.attributeName === 'style'){
          // console.log("style change");
          // console.log(mutation.target.style.transform)
          // console.log(mutation.target.attributes[3].value)
          // console.log(mutationList);

          const rotateDeg = mutation.target.style.transform;
          document.querySelector(".mapboxgl-ctrl-compass-custom-button").querySelector("img").style.transform = rotateDeg;

          if (rotateDeg === "rotate(0deg)") {
            document.querySelector(".mapboxgl-ctrl-compass-custom-button").style.visibility = "hidden";
          } else {
            document.querySelector(".mapboxgl-ctrl-compass-custom-button").style.visibility = "visible";
          }
        }
      })
    }

    const observer = new MutationObserver(callback);
    const interval = setInterval(() => {
      console.log("•")
      if (document.querySelector('button[aria-label="Reset bearing to north"]') !== null) {
        observer.observe(document.querySelector('button[aria-label="Reset bearing to north"]').querySelector("span"), {attributes: true});
        clearInterval(interval)
      } /*else if (document.querySelector('button[aria-label="Location not available"]') !== null) {
        document.querySelector(".mapboxgl-ctrl-geolocate-custom-button").querySelector("img").setAttribute("src", geolocationControlDisabledIcon);
        clearInterval(interval);
      }*/
    }, 100);
  }, [])

  return (
    <div className={`mapboxgl-ctrl-geolocate-custom-buttons__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`}>
      <button
        className="mapboxgl-ctrl-compass-custom-button"
        onClick={(e) => {
          if (document.querySelector('button[aria-label="Reset bearing to north"]') !== null) {
            const compassBtn = document.querySelector('button[aria-label="Reset bearing to north"]');
            compassBtn.click();
            // console.log(document.querySelector('button[aria-label="Reset bearing to north"]').querySelector("span").style.transform);
          }
        }}
      >
        <img
          src={
            theme.palette.mode === "light" ? compassIcon : compassDarkIcon
          }
          alt="Reset bearing to north"
        />
      </button>

      <button
        className="mapboxgl-ctrl-geolocate-custom-button"
        onClick={(e) => {
          if (document.querySelector('button[aria-label="Location not available"]') === null) {
            const geolocateBtn = document.querySelector('button[aria-label="Find my location"]');
            geolocateBtn.click();
          }
        }}
      >
        <img
          src={
            theme.palette.mode === "light" ? geolocationControlOffIcon : geolocationControlOffDarkIcon
          }
          alt="Find my location"
        />
      </button>
    </div>
  )
}

export default MapboxButtons;