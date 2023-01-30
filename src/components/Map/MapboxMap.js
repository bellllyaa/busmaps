import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "./MapboxMap.css";
import { useTheme } from '@mui/material/styles';

import zkmBusStops from "../../data/zkm-bus-stops.json";
import {
  useToggleDrawer,
  useBusStop,
  useLastOpenedStops,
} from "../../pages/Home";
import MapboxButtons from "./MapButtons/MapboxButtons";
// import geolocationControlOffIcon from "../../assets/map-custom-controls/geolocation-control-off.svg";
// import geolocationControlOffDarkIcon from "../../assets/map-custom-controls/geolocation-control-off-dark.svg";
// import geolocationControlIcon from "../../assets/map-custom-controls/geolocation-control.svg";
// import geolocationControlDarkIcon from "../../assets/map-custom-controls/geolocation-control-dark.svg";
// import geolocationControlActiveIcon from "../../assets/map-custom-controls/geolocation-control-active.svg";
import busIcon from "../../assets/bus.svg";
import busDarkIcon from "../../assets/bus-dark.svg";
import impostorIcon from "../../assets/impostor.svg";
import impostorDarkIcon from "../../assets/impostor-dark.svg";
import starIcon from "../../assets/star1.svg";
import DownloadBanner from "../DownloadBanner/DownloadBanner";
import SearchBar from "../Search/SearchBar";
import sortStopsByLocation from "../../hooks/sortStopsByLocation";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYmVsbGx5YWEiLCJhIjoiY2xkYXFva3FpMDV5NTN2bmNuOHBjdnI1dSJ9.uH1jtv5wk0ENiGTWAtKzxA";

const getLastUserLocation = (par) => {
  const lastMapCenter = JSON.parse(localStorage.getItem("mapCenter"));
  if (par === "Lng") {
    if (lastMapCenter != null) {
      return Number(lastMapCenter.lng);
    } else {
      return 18.5387945;
    }
  } else if (par === "Lat") {
    if (lastMapCenter != null) {
      return Number(lastMapCenter.lat);
    } else {
      return 54.5176944;
    }
  }
};

let currentMarkers = {lng: null, lat: null, zoom: null, markers: null, status: "created"};

function MapboxMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(getLastUserLocation("Lng"));
  const [lat, setLat] = useState(getLastUserLocation("Lat"));
  const [zoom, setZoom] = useState(13);
  const theme = useTheme();

  const { toggleDrawer, setToggleDrawer } = useToggleDrawer();
  const { busStop, setBusStop } = useBusStop();
  // const [currentMarkers, setCurrentMarkers] = useState("bb");

  const setToggleDrawerFunc = (value, busStop) => {
    // document.getElementById("bus-stop__select__dropdown").style.display = "none";

    // localStorage.setItem("lastOpenedStopId0", busStop.stopId);
    // localStorage.setItem("lastOpenedStopName0", busStop.stopName);

    // console.log(localStorage.getItem("lastOpenedStopId0"));

    setBusStop(busStop);
    setToggleDrawer(value);

    // console.log(busStop);
  };

  // const setCurrentMarkersFunc = (value) => {
  //   console.log("Setting currentMarkers...");
  //   setCurrentMarkers(value);
  // }

  const isFavorite = (currentStop) => {
    const favoriteStops = JSON.parse(localStorage.getItem("favoriteStops"));

    if (favoriteStops === null) {
      return false;
    }

    for (const stop of favoriteStops) {
      if (stop.stopId === currentStop.stopId && stop.stopName === currentStop.stopName) {
        return true;
      }
    }

    return false;
  }

  const isSelected = (currentStop) => {
    const lastOpenedStops = JSON.parse(localStorage.getItem("lastOpenedStops"));

    if (lastOpenedStops === null) {
      return false;
    }

    if (currentStop.stopId === lastOpenedStops[0].stopId && currentStop.stopName === lastOpenedStops[0].stopName) {
      return true;
    } else {
      return false;
    }
  }

  const addBusStops = (currentMapCenter, force) => {

    // console.log(Math.abs(currentMarkers.lng - currentMapCenter.lng))
    // console.log(Math.abs(currentMarkers.lat - currentMapCenter.lat))

    if (currentMapCenter.zoom >= 14.00 && currentMarkers.status === "created") {

      currentMarkers.status = "changed";
      // console.log(".");
      // console.log(currentMapCenter.zoom);
      // console.log(currentMarkers);

    } else if (currentMapCenter.zoom >= 14.00 && currentMarkers.lng === null && currentMarkers.status === "changed") {

      // console.log(".");

    } else if ((force && currentMapCenter.zoom >= 14.00) || currentMapCenter.zoom >= 14.00 && currentMarkers.lng != null && (Math.abs(currentMarkers.lng - currentMapCenter.lng) > 0.005 || Math.abs(currentMarkers.lat - currentMapCenter.lat)) > 0.005) {
      
      for (const marker of currentMarkers.markers) {
        marker.remove();
      }
      currentMarkers = {lng: null, lat: null, zoom: null, markers: null, status: "changed"};
      // console.log(currentMarkers);

      // return;

    } else if (currentMarkers.lng != null && currentMapCenter.zoom < 14.00) {
      
      for (const marker of currentMarkers.markers) {
        marker.remove();
      }
      currentMarkers = {lng: null, lat: null, zoom: null, markers: null, status: "changed"};
      // console.log(currentMarkers);
      return;

    } else {
      return;
    }

    // if (document.getElementsByClassName("mapboxgl-ctrl-geolocate-active").length === 1) {
    //   localStorage.setItem("lastUserLocationLon", lng);
    //   localStorage.setItem("lastUserLocationLat", lat);
    //   console.log(map.current)
    //   console.log(lng, lat);
    // }

    console.log("Adding stops...");
    // console.log(map.current);
    // console.log(currentMapCenter);

    let currentMarkersList = [];

    for (const stop of zkmBusStops) {
      
      if (!(Math.abs(stop.stopLon - currentMapCenter.lng).toFixed(5) < 0.01 && Math.abs(stop.stopLat - currentMapCenter.lat).toFixed(5) < 0.01)) {
        continue
      }
      // console.log(stop.stopName);
      // console.log(stop.stopName);
      // console.log(Math.abs(stop.stopLon - currentMapCenter.lng).toFixed(5));
      // console.log(Math.abs(stop.stopLat - currentMapCenter.lat));

      const isStopSelected = isSelected(stop);
      const el = document.createElement("div");
      const width = 20;
      const height = 20;
      el.className = "marker";

      const elIcon = document.createElement("img");
      elIcon.setAttribute(
        "src",
        theme.palette.mode === "light" && !isStopSelected
          ? localStorage.getItem("mode") === "ohio"
            ? impostorDarkIcon
            : busIcon
          : localStorage.getItem("mode") === "ohio"
          ? impostorIcon
          : busDarkIcon
      );
      elIcon.setAttribute("alt", "Stop button");
      elIcon.style.height = `${height}px`;
      elIcon.style.width = `${width}px`;
      elIcon.style.backgroundColor = isStopSelected ? "#ffffff" : "#3b92f2";
      if (isStopSelected && theme.palette.mode === "light") {
        elIcon.style.boxShadow = "0px 0px 5px 0px rgba(17, 17, 17, 0.3)"
      }
      elIcon.style.padding = "4px";
      elIcon.style.margin = "10px";
      elIcon.style.borderRadius = "4px";
      el.appendChild(elIcon);

      if (isFavorite(stop)) {
        const elStarIcon = document.createElement("img");
        elStarIcon.setAttribute(
          "src", starIcon);
        elStarIcon.setAttribute("alt", "Favorite");
        elStarIcon.style.height = "15px";
        elStarIcon.style.width = "15px";
        elStarIcon.style.backgroundColor = theme.palette.mode === "light" ? "#ffffff" : "#232527";
        elStarIcon.style.borderRadius = "50%";
        elStarIcon.style.transform = "translateY(-20px) translateX(-20px)";
        if (isStopSelected && theme.palette.mode === "light") {
          elStarIcon.style.boxShadow = "0px 0px 5px 0px rgba(17, 17, 17, 0.1)"
        }
        el.appendChild(elStarIcon);
      }

      el.addEventListener("click", () => {
        setToggleDrawerFunc(true, stop);
        // console.log(stop.stopName);
      });

      // console.log(map.current);

      let marker = new mapboxgl.Marker(el)
        .setLngLat([stop.stopLon, stop.stopLat])
        .addTo(map.current);
        currentMarkersList.push(marker);
    }
    // console.log(".");
    // console.log(currentMarkers);
    // console.log({lng: currentMapCenter.lng, lat: currentMapCenter.lat, zoom: currentMapCenter.zoom, markers: currentMarkersList});
    //setCurrentMarkers({lng: currentMapCenter.lng, lat: currentMapCenter.lat, zoom: currentMapCenter.zoom, markers: currentMarkersList});
    // setCurrentMarkersFunc("bruh");
    currentMarkers.lng = currentMapCenter.lng;
    currentMarkers.lat = currentMapCenter.lat;
    currentMarkers.zoom = currentMapCenter.zoom;
    currentMarkers.markers = currentMarkersList;
    // console.log(currentMarkers);
    // console.log(".");
  };

  useEffect(() => {

    // if (theme.palette.mode !== "light") {
    //   try {
        // const geolocateEl = document.querySelector('span[title="Find my location"]');
        // geolocateEl.style.backgroundColor = "black";
        // geolocateEl.style.fill = "white";
        // const zoomInEl = document.querySelector('span[title="Zoom in"]');
        // zoomInEl.style.backgroundColor = "black";
        // zoomInEl.style.borderBottom = "none";
        // const zoomOutEl = document.querySelector('span[title="Zoom out"]');
        // zoomOutEl.style.backgroundColor = "black";
        // zoomOutEl.style.borderTop = "1px solid #45484c";
        // console.log(el);
    //   } catch {}
    // }

    if (window.navigator.standalone == true) {
      const interval = setInterval(() => {
        try {
          document.querySelector(".mapboxgl-ctrl-top-right").style.top = "60vh";
          clearInterval(interval);
        } catch {}
      }, 100);
    } else {
      const interval = setInterval(() => {
        try {
          document.querySelector(".mapboxgl-ctrl-top-right").style.top = "45vh";
          clearInterval(interval);
        } catch {}
      }, 100);
    }

    // console.log(theme);
    // theme.palette.mode === "light"
    //   ? grey[100]
    //   : theme.palette.background.default

    // console.log("useEffect");
    setTimeout(() => {map.current.flyTo({center: [lng, lat], zoom: 15})}, 1000);

    if (localStorage.getItem("userLocation") != null) {
      const lastUserLocation = JSON.parse(localStorage.getItem("userLocation"));

      zkmBusStops = sortStopsByLocation(zkmBusStops, {lon: Number(lastUserLocation.lng), lat: Number(lastUserLocation.lat)})

      // console.log(zkmBusStops);
    }
    sessionStorage.setItem("zkmBusStops", JSON.stringify(zkmBusStops));

    if (localStorage.getItem("lastOpenedStops") != null) {
      let lastOpenedStop = JSON.parse(localStorage.getItem("lastOpenedStops"))[0];
      setToggleDrawerFunc(true, {
        stopId: Number(lastOpenedStop.stopId),
        stopName: lastOpenedStop.stopName,
      });
    }
  }, []);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: theme.palette.mode === "light"
      ? "mapbox://styles/mapbox/streets-v12"
      : "mapbox://styles/mapbox/dark-v10",
      // style: "mapbox://styles/mapbox/dark-v10",
      center: [lng, lat],
      zoom: zoom,
      // attributionControl: false
    });

    // map.current.addControl(new mapboxgl.NavigationControl());

    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        // showUserHeading: true,
        screenTop: "right",
      })
    );

    map.current.addControl(new mapboxgl.NavigationControl());

    // setTimeout(() => {
    //   const el = document.querySelector('button[aria-label="Find my location"]');
    //   console.log(el);
    //   el.addEventListener("load", () => {console.log(el)});
    // }, 500)

    // class MyCustomControl {
    //   onAdd(map){
    //     this.map = map;
    //     this.container = document.createElement('div');
    //     // this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    //     this.container.className = `mapboxgl-ctrl mapboxgl-ctrl-geolocate-custom-buttons__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`;

    //     // this.geolocationButton = document.createElement('button');
        
    //     const locationButton = document.createElement('button');
    //     locationButton.className = "mapboxgl-ctrl-geolocate-custom-button";
    //     locationButton.type = "button";
    //     // locationButton.addEventListener("click", () => {
    //     //   console.log("clicked")
    //     // })
    //     locationButton.onclick = () => {
    //       console.log("clicked")
    //     }
    //     console.log(this.container);

    //     const locationButtonImg = document.createElement("img");
    //     locationButtonImg.className = "mapboxgl-ctrl-geolocate-custom-button-img";
    //     locationButtonImg.setAttribute(
    //       "src", theme.palette.mode === "light" ? geolocationControlOffIcon : geolocationControlOffDarkIcon);
    //     locationButtonImg.setAttribute("alt", "Find my location");
    //     locationButton.appendChild(locationButtonImg);
    //     // locationButton.addEventListener("click", function() {
    //     //   console.log("clicked");
    //     // });

    //     this.container.appendChild(locationButton);
    //     return this.container;
    //   }
    //   onRemove(){
    //     this.container.parentNode.removeChild(this.container);
    //     this.map = undefined;
    //   }
    // }
    
    // map.current.addControl(new MyCustomControl());
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
      addBusStops({
        lng: map.current.getCenter().lng.toFixed(4),
        lat: map.current.getCenter().lat.toFixed(4),
        zoom: map.current.getZoom().toFixed(2),
      });
    });

    map.current.on("moveend", () => {
      localStorage.setItem("mapCenter", JSON.stringify({lng: lng, lat: lat}));
      if (document.getElementsByClassName("mapboxgl-ctrl-geolocate-active").length === 1) {
        // localStorage.setItem("lastUserLocationLon", lng);
        // localStorage.setItem("lastUserLocationLat", lat);

        localStorage.setItem("userLocation", JSON.stringify({lng: lng, lat: lat, time: new Date()}));

        // console.log(sessionStorage.getItem("userLocation"));
        // console.log(JSON.parse(sessionStorage.getItem("userLocation")));
        // console.log(Date.parse(JSON.parse(sessionStorage.getItem("userLocation")).time));
        // console.log(new Date() - Date.parse(JSON.parse(sessionStorage.getItem("userLocation")).time))
      }
    });

    if (currentMarkers.status === "created") {
      addBusStops({
        lng: map.current.getCenter().lng.toFixed(4),
        lat: map.current.getCenter().lat.toFixed(4),
        zoom: map.current.getZoom().toFixed(2),
      });
    }
  });

  useEffect(() => {
    if (toggleDrawer === true && sessionStorage.getItem("mapFlyToStop") === "true") {
      const interval = setInterval(() => {
        if (document.querySelector("#departures-table") != null) {
          // console.log(document.querySelector("#departures-table"));

          if (localStorage.getItem("lastOpenedStops") != null) {
            let lastOpenedStop = JSON.parse(localStorage.getItem("lastOpenedStops"))[0];
            map.current.flyTo({center: [lastOpenedStop.lng, lastOpenedStop.lat], zoom: 15});
            sessionStorage.removeItem("mapFlyToStop");
            clearInterval(interval);
          }
        }
      }, 200);
    }
  }, [toggleDrawer])

  return (
    <div>
      {/* <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div> */}
      <DownloadBanner />
      <SearchBar />
      <button id="map-update-button" onClick={() => {
        addBusStops({
          lng: lng,
          lat: lat,
          zoom: zoom,
        }, true);
      }}></button>

      <MapboxButtons />

      <div ref={mapContainer} className="map-container" />
      {/* <button class="mapboxgl-ctrl-geolocate mapboxgl-ctrl-geolocate-active" type="button" aria-label="Find my location" aria-pressed="true"><span class="mapboxgl-ctrl-icon" aria-hidden="true" title="Find my location"></span></button> */}
    </div>
  );
}

export default MapboxMap;