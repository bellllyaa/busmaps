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

  return (
    <div className={`mapboxgl-ctrl-geolocate-custom-buttons__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`}>
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