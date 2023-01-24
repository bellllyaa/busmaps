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
import busIcon from "../../assets/bus.svg";
import busDarkIcon from "../../assets/bus-dark.svg";
import SearchBar from "../Search/SearchBar";
import sortStopsByLocation from "../../hooks/sortStopsByLocation";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYmVsbGx5YWEiLCJhIjoiY2xkYXFva3FpMDV5NTN2bmNuOHBjdnI1dSJ9.uH1jtv5wk0ENiGTWAtKzxA";

const getLastUserLocation = (par) => {
  if (par === "Lng") {
    if (localStorage.getItem("userLocation") != null) {
      return Number(JSON.parse(localStorage.getItem("userLocation")).lng);
    } else {
      return 18.5387945;
    }
  } else if (par === "Lat") {
    if (localStorage.getItem("userLocation") != null) {
      return Number(JSON.parse(localStorage.getItem("userLocation")).lat);
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

    console.log(busStop);
  };

  // const setCurrentMarkersFunc = (value) => {
  //   console.log("Setting currentMarkers...");
  //   setCurrentMarkers(value);
  // }

  const addBusStops = (currentMapCenter) => {

    // console.log(Math.abs(currentMarkers.lng - currentMapCenter.lng))
    // console.log(Math.abs(currentMarkers.lat - currentMapCenter.lat))

    if (currentMapCenter.zoom >= 14.00 && currentMarkers.status === "created") {

      currentMarkers.status = "changed";
      console.log(".");
      console.log(currentMapCenter.zoom);
      console.log(currentMarkers);

    } else if (currentMapCenter.zoom >= 14.00 && currentMarkers.lng === null && currentMarkers.status === "changed") {

      console.log(".");

    } else if (currentMapCenter.zoom >= 14.00 && currentMarkers.lng != null && (Math.abs(currentMarkers.lng - currentMapCenter.lng) > 0.005 || Math.abs(currentMarkers.lat - currentMapCenter.lat)) > 0.005) {
      
      for (const marker of currentMarkers.markers) {
        marker.remove();
      }
      currentMarkers = {lng: null, lat: null, zoom: null, markers: null, status: "changed"};
      console.log(currentMarkers);

      return;

    } else if (currentMarkers.lng != null && currentMapCenter.zoom < 14.00) {
      
      for (const marker of currentMarkers.markers) {
        marker.remove();
      }
      currentMarkers = {lng: null, lat: null, zoom: null, markers: null, status: "changed"};
      console.log(currentMarkers);
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

      const el = document.createElement("div");
      const width = 20;
      const height = 20;
      el.className = "marker";

      const elIcon = document.createElement("img");
      elIcon.setAttribute("src", theme.palette.mode === "light" ? busIcon : busDarkIcon);
      elIcon.setAttribute("alt", "Stop button");
      elIcon.style.height = `${height}px`;
      elIcon.style.width = `${width}px`;
      elIcon.style.backgroundColor = "#3b92f2";
      elIcon.style.padding = "4px";
      elIcon.style.margin = "10px";
      elIcon.style.borderRadius = "4px";
      // elIcon.style.fill = "#ffffff";
      el.appendChild(elIcon);

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
    console.log(".");
    console.log(currentMarkers);
    // console.log({lng: currentMapCenter.lng, lat: currentMapCenter.lat, zoom: currentMapCenter.zoom, markers: currentMarkersList});
    //setCurrentMarkers({lng: currentMapCenter.lng, lat: currentMapCenter.lat, zoom: currentMapCenter.zoom, markers: currentMarkersList});
    // setCurrentMarkersFunc("bruh");
    currentMarkers.lng = currentMapCenter.lng;
    currentMarkers.lat = currentMapCenter.lat;
    currentMarkers.zoom = currentMapCenter.zoom;
    currentMarkers.markers = currentMarkersList;
    console.log(currentMarkers);
    console.log(".");
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

      console.log(zkmBusStops);
    }
    sessionStorage.setItem("zkmBusStops", JSON.stringify(zkmBusStops));

    if (localStorage.getItem("lastOpenedStops") != null) {
      let lastOpenedStop = JSON.parse(localStorage.getItem("lastOpenedStops"))[0];
      setToggleDrawerFunc(true, {
        stopId: Number(lastOpenedStop.stopId),
        stopName: lastOpenedStop.stopName,
      });
    }
    if (window.navigator.userAgent.slice(13, 19) === "iPhone" && false) {
      // console.log("iPhone")
      // document.getElementsByClassName("leaflet-container")[0].style.height =
      //   "calc(100vh - 20px)";
      // console.log(document.getElementsByClassName("leaflet-container"));
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
        showUserHeading: true,
        screenTop: "right"
      })
    );

    map.current.addControl(new mapboxgl.NavigationControl());
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
    if (toggleDrawer === true) {
      const interval = setInterval(() => {
        if (document.querySelector("#departures-table") != null) {
          // console.log(document.querySelector("#departures-table"));

          if (localStorage.getItem("lastOpenedStops") != null) {
            let lastOpenedStop = JSON.parse(localStorage.getItem("lastOpenedStops"))[0];
            map.current.flyTo({center: [lastOpenedStop.lng, lastOpenedStop.lat], zoom: 15});
            // console.log("Clearing interval...");
            clearInterval(interval);
          }
        } else {
          // console.log("Failed to display element");
        }
      }, 200);
    }
  }, [toggleDrawer])

  return (
    <div>
      {/* <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div> */}
      <SearchBar />
      <div ref={mapContainer} className="map-container" />
      {/* <button class="mapboxgl-ctrl-geolocate mapboxgl-ctrl-geolocate-active" type="button" aria-label="Find my location" aria-pressed="true"><span class="mapboxgl-ctrl-icon" aria-hidden="true" title="Find my location"></span></button> */}
    </div>
  );
}

export default MapboxMap;