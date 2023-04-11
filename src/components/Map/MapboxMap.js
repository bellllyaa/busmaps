import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "./MapboxMap.css";
import { useTheme } from '@mui/material/styles';

import {
  useToggleDrawer,
  useCurrentStop,
  useCurrentTrip
} from "../../pages/Home";
import pythagoras from "../../hooks/pythagoras";

import MapboxButtons from "./MapButtons/MapboxButtons";
import busIcon from "../../assets/bus.svg";
import busDarkIcon from "../../assets/bus-dark.svg";
import tramIcon from "../../assets/tram.svg";
import tramDarkIcon from "../../assets/tram-dark.svg";
import trainIcon from "../../assets/train.svg";
import trainDarkIcon from "../../assets/train-dark.svg";
import impostorIcon from "../../assets/impostor.svg";
import impostorDarkIcon from "../../assets/impostor-dark.svg";
import starIcon from "../../assets/star1.svg";
import DownloadBanner from "../DownloadBanner/DownloadBanner";
import SearchBar from "../Search/SearchBar";
import sortStopsByLocation from "../../hooks/sortStopsByLocation";

// Safe token
// mapboxgl.accessToken =
//   "pk.eyJ1IjoiYmVsbGx5YWEiLCJhIjoiY2xkYXFva3FpMDV5NTN2bmNuOHBjdnI1dSJ9.uH1jtv5wk0ENiGTWAtKzxA";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYmVsbGx5YWEiLCJhIjoiY2xjeG1hazJyMG41NzN3cXJ5bDFoZGFpMSJ9.kjSwIXyUxEUzLycrSD4Iag";

const LOCAL_URL = "http://localhost:8080";
const GOOGLE_PROXY_URL = "https://bypass-cors-server.ew.r.appspot.com";
const AZURE_PROXY_URL = "https://busmaps-server.azurewebsites.net"
const PROXY_URL = AZURE_PROXY_URL;

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
  const [currentRouteSourceId, setCurrentRouteSourceId] = useState(null);
  
  const theme = useTheme();
  const { toggleDrawer, setToggleDrawer } = useToggleDrawer();
  const { currentStop, setCurrentStop } = useCurrentStop();
  const { currentTrip, setCurrentTrip } = useCurrentTrip();
  // const [currentMarkers, setCurrentMarkers] = useState("bb");

  const setToggleDrawerFunc = (value, stop) => {
    // setBusStop(busStop);
    setCurrentTrip(null);
    setCurrentStop(stop);
    setToggleDrawer(value);
  };

  // const setCurrentMarkersFunc = (value) => {
  //   console.log("Setting currentMarkers...");
  //   setCurrentMarkers(value);
  // }

  const isStopFavorite = (currentStop) => {
    const favoriteStops = JSON.parse(localStorage.getItem("favoriteStops"));

    if (favoriteStops === null) {
      return false;
    }

    for (const stop of favoriteStops) {
      if (
        stop.stopName === currentStop.stopName &&
        pythagoras(
          Math.abs(stop.location.lng - currentStop.location.lng),
          Math.abs(stop.location.lat - currentStop.location.lat)
        ) < 0.005
      ) {
        return true;
      }
    }

    return false;
  }

  const isStopSelected = (currentStop) => {
    const lastOpenedStops = JSON.parse(localStorage.getItem("lastOpenedStops"));

    if (lastOpenedStops === null) {
      return false;
    }

    if (
      currentStop.stopName === lastOpenedStops[0].stopName &&
        pythagoras(
          Math.abs(currentStop.location.lng - lastOpenedStops[0].location.lng),
          Math.abs(currentStop.location.lat - lastOpenedStops[0].location.lat)
        ) < 0.005
    ) {
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

    } else if (currentMapCenter.zoom >= 14.00 && currentMarkers.lng === null && currentMarkers.status === "changed") {

      // console.log(".");

    } else if ((force && currentMapCenter.zoom >= 14.00) || currentMapCenter.zoom >= 14.00 && currentMarkers.lng != null && (Math.abs(currentMarkers.lng - currentMapCenter.lng) > 0.005 || Math.abs(currentMarkers.lat - currentMapCenter.lat)) > 0.005) {
      
      for (const marker of currentMarkers.markers) {
        marker.remove();
      }
      currentMarkers = {lng: null, lat: null, zoom: null, markers: null, status: "changed"};

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

    console.log("Adding stops...");
    // console.log(map.current);
    // console.log(currentMapCenter);

    let currentMarkersList = [];
    let zkmBusStops = []

    for (const stop of zkmBusStops) {
      
      if (!(Math.abs(stop.stopLon - currentMapCenter.lng).toFixed(5) < 0.01 && Math.abs(stop.stopLat - currentMapCenter.lat).toFixed(5) < 0.01)) {
        continue
      }
      // console.log(stop.stopName);
      // console.log(stop.stopName);
      // console.log(Math.abs(stop.stopLon - currentMapCenter.lng).toFixed(5));
      // console.log(Math.abs(stop.stopLat - currentMapCenter.lat));

      const isStopSelected = isStopSelected(stop);
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

      if (isStopFavorite(stop)) {
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

  const updateDisplayedStops = (currentMapCenter, force) => {

    if (currentMapCenter.zoom >= 14.00 && currentMarkers.status === "created") {

      currentMarkers.status = "changed";

    } else if (currentMapCenter.zoom >= 14.00 && currentMarkers.lng === null && currentMarkers.status === "changed") {

      // console.log(".");

    } else if ((force && currentMapCenter.zoom >= 14.00) || currentMapCenter.zoom >= 14.00 && currentMarkers.lng != null && (Math.abs(currentMarkers.lng - currentMapCenter.lng) > 0.005 || Math.abs(currentMarkers.lat - currentMapCenter.lat)) > 0.005) {
      
      for (const marker of currentMarkers.markers) {
        marker.remove();
      }
      currentMarkers = {lng: null, lat: null, zoom: null, markers: null, status: "changed"};

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

    console.log("Adding stops...");
    // console.log(map.current);
    // console.log(currentMapCenter);

    const stops = JSON.parse(localStorage.getItem("stops"));
    let currentMarkersList = [];

    for (const stop of stops) {
      
      if (!(Math.abs(stop.location.lng - currentMapCenter.lng).toFixed(5) < 0.01 && Math.abs(stop.location.lat - currentMapCenter.lat).toFixed(5) < 0.01)) {
        continue
      }
      // console.log(stop.stopName);
      // console.log(stop.stopName);
      // console.log(Math.abs(stop.stopLon - currentMapCenter.lng).toFixed(5));
      // console.log(Math.abs(stop.stopLat - currentMapCenter.lat));

      const isCurrentStopSelected = isStopSelected(stop);
      
      const el = document.createElement("div");
      let width = 20;
      let height = 20;
      el.className = "marker";

      const elIcon = document.createElement("img");
      elIcon.setAttribute("alt", "Stop button");
      elIcon.style.borderRadius = "4px";
      elIcon.style.margin = "15px";

      if (stop.stopType === "train") {

        elIcon.setAttribute(
          "src",
          theme.palette.mode === "light" && !isCurrentStopSelected
            ? trainIcon
            : trainDarkIcon
        );
        elIcon.style.backgroundColor = "#e9b800";
        elIcon.style.padding = "4.5px";
        elIcon.style.borderRadius = "6px";
        height = 25;
        width = 25;

      } else if (stop.stopType === "tram" || stop.stopType === "bus, tram") {

        elIcon.setAttribute(
          "src",
          theme.palette.mode === "light" && !isCurrentStopSelected
            ? tramIcon
            : tramDarkIcon
        );
        elIcon.style.backgroundColor = "#f20000";
        elIcon.style.padding = "3px";

      } else {

        elIcon.setAttribute(
          "src",
          theme.palette.mode === "light" && !isCurrentStopSelected
            ? busIcon
            : busDarkIcon
        );
        elIcon.style.backgroundColor = "#3b92f2";
        elIcon.style.padding = "4px";

      }
      if (stop.stopType === "bus, tram") {
        elIcon.style.marginLeft = "2px";

        const elIcon1 = document.createElement("img");
        elIcon1.setAttribute("alt", "Stop button");
        elIcon1.style.borderRadius = "4px";
        elIcon1.style.margin = "15px 0 15px 15px";
        elIcon1.setAttribute(
          "src",
          theme.palette.mode === "light" && !isCurrentStopSelected
            ? busIcon
            : busDarkIcon
        );
        elIcon1.style.backgroundColor = isCurrentStopSelected ? "#ffffff" : "#3b92f2";
        elIcon1.style.padding = "4px";
        elIcon1.style.height = `${height}px`;
        elIcon1.style.width = `${width}px`;
        el.appendChild(elIcon1);
      }

      if (localStorage.getItem("mode") === "ohio") {
        elIcon.setAttribute(
          "src",
          theme.palette.mode === "light" && !isCurrentStopSelected
            ? impostorDarkIcon
            : impostorIcon
        );
        elIcon.style.padding = "4px";
      }

      elIcon.style.height = `${height}px`;
      elIcon.style.width = `${width}px`;
      if (isCurrentStopSelected) {
        elIcon.style.backgroundColor = "#ffffff"
      }
      
      if (isCurrentStopSelected && theme.palette.mode === "light") {
        elIcon.style.boxShadow = "0px 0px 5px 0px rgba(17, 17, 17, 0.3)"
      }
      
      el.appendChild(elIcon);

      if (isStopFavorite(stop)) {
        const elStarIcon = document.createElement("img");
        elStarIcon.setAttribute(
          "src", starIcon);
        elStarIcon.setAttribute("alt", "Favorite");
        elStarIcon.style.height = `${height * 3 / 4}px` //"15px";
        elStarIcon.style.width = `${width * 3 / 4}px` //"15px";
        elStarIcon.style.backgroundColor = theme.palette.mode === "light" ? "#ffffff" : "#232527";
        elStarIcon.style.borderRadius = "50%";
        elStarIcon.style.transform = `translateY(-${height+5}px) translateX(-${width+3}px)`;
        if (isCurrentStopSelected && theme.palette.mode === "light") {
          elStarIcon.style.boxShadow = "0px 0px 5px 0px rgba(17, 17, 17, 0.1)"
        }
        el.appendChild(elStarIcon);
      }

      el.addEventListener("click", (e) => {
        map.current.flyTo({center: [stop.location.lng, stop.location.lat], zoom: map.current.getZoom()})
        // console.log(e.target)
        // elIcon.style.backgroundColor = "#ffffff"
        setToggleDrawerFunc(true, stop);
        // console.log(stop);
      });

      // console.log(map.current);

      let marker = new mapboxgl.Marker(el)
        .setLngLat([stop.location.lng, stop.location.lat])
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

    // if (window.navigator.standalone == true) {
    //   const interval = setInterval(() => {
    //     try {
    //       document.querySelector(".mapboxgl-ctrl-top-right").style.top = "60vh";
    //       clearInterval(interval);
    //     } catch {}
    //   }, 100);
    // } else {
    //   const interval = setInterval(() => {
    //     try {
    //       document.querySelector(".mapboxgl-ctrl-top-right").style.top = "45vh";
    //       clearInterval(interval);
    //     } catch {}
    //   }, 100);
    // }

    // console.log("useEffect");
    setTimeout(() => {map.current.flyTo({center: [lng, lat], zoom: 15})}, 1000);

    fetch(PROXY_URL + "/stops")
      .then(response => response.json())
      .then(data => {
        let stops = data;

        if (localStorage.getItem("userLocation") != null) {
          const lastUserLocation = JSON.parse(localStorage.getItem("userLocation"));
          stops = sortStopsByLocation(data, {lng: Number(lastUserLocation.lng), lat: Number(lastUserLocation.lat)})
        }

        console.log("Stops:")
        console.log(stops)
        localStorage.setItem("stops", JSON.stringify(stops));
        updateDisplayedStops({
          lng: map.current.getCenter().lng.toFixed(4),
          lat: map.current.getCenter().lat.toFixed(4),
          zoom: map.current.getZoom(),
        })
      })
      .catch(error => {
        if (localStorage.getItem("stops") !== null) {
          updateDisplayedStops({
            lng: map.current.getCenter().lng.toFixed(4),
            lat: map.current.getCenter().lat.toFixed(4),
            zoom: map.current.getZoom(),
          })
        }
      })

    if (localStorage.getItem("lastOpenedStops") != null) {
      let lastOpenedStop = JSON.parse(localStorage.getItem("lastOpenedStops"))[0];
      setToggleDrawerFunc(true, lastOpenedStop);
    }
  }, []);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: theme.palette.mode === "light"
      ? "mapbox://styles/mapbox/streets-v12"
      : "mapbox://styles/mapbox/dark-v10",
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
      setZoom(map.current.getZoom());
      // addBusStops({
      //   lng: map.current.getCenter().lng.toFixed(4),
      //   lat: map.current.getCenter().lat.toFixed(4),
      //   zoom: map.current.getZoom().toFixed(2),
      // });
      updateDisplayedStops({
        lng: map.current.getCenter().lng.toFixed(4),
        lat: map.current.getCenter().lat.toFixed(4),
        zoom: map.current.getZoom(),
      })
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

    // if (currentMarkers.status === "created") {
    //   // addBusStops({
    //   //   lng: map.current.getCenter().lng.toFixed(4),
    //   //   lat: map.current.getCenter().lat.toFixed(4),
    //   //   zoom: map.current.getZoom().toFixed(2),
    //   // });
    //   updateDisplayedStops({
    //     lng: map.current.getCenter().lng.toFixed(4),
    //     lat: map.current.getCenter().lat.toFixed(4),
    //     zoom: map.current.getZoom().toFixed(2),
    //   })
    // }
  });

  useEffect(() => {
    if (toggleDrawer === true && sessionStorage.getItem("mapFlyToStop") === "true") {
      const interval = setInterval(() => {
        if (document.querySelector("#departures-table") != null) {
          // console.log(document.querySelector("#departures-table"));

          if (localStorage.getItem("lastOpenedStops") != null) {
            let lastOpenedStop = JSON.parse(localStorage.getItem("lastOpenedStops"))[0];
            map.current.flyTo({center: [lastOpenedStop.location.lng, lastOpenedStop.location.lat], zoom: 15});
            sessionStorage.removeItem("mapFlyToStop");
            clearInterval(interval);
          }
        }
      }, 200);
    }
  }, [currentStop])

  useEffect(() => {
    if (currentTrip === null) {
      if (currentRouteSourceId !== null) {
        if (map.current.getLayer(currentRouteSourceId)) map.current.removeLayer(currentRouteSourceId);
        setCurrentRouteSourceId(null)
      }
    } else {

      const currentTripSourceId = `route_${currentTrip.provider.replace(" ", "-")}_${currentTrip.routeType}_${currentTrip.routeId}_${currentTrip.tripId}`;
      console.log(currentTripSourceId)
      setCurrentRouteSourceId(currentTripSourceId)

      if (map.current.getSource(currentTripSourceId)) {
        map.current.addLayer({
          id: currentTripSourceId,
          type: "line",
          source: currentTripSourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": "#89b3f8",
            "line-width": 8
          }
        })
      } else {
        fetch(PROXY_URL + "/get-shapes",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentTrip),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)

          if (!data.coordinates) {
            return
          }

          map.current.addSource(currentTripSourceId, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: data.coordinates
              }
            }
          });

          map.current.addLayer({
            id: currentTripSourceId,
            type: "line",
            source: currentTripSourceId,
            layout: {
              "line-join": "round",
              "line-cap": "round"
            },
            paint: {
              "line-color": currentTrip.routeType === "train" ? "#e9b800" : currentTrip.routeType === "tram" ? "#f20000" : "#89b3f8",
              "line-width": 8
            }
          })
        })
        .catch(error => console.log(error))
      }

    }
  }, [currentTrip])

  return (
    <div>
      {/* <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div> */}
      <DownloadBanner />
      <SearchBar />
      <button id="map-update-button" onClick={() => {
        // addBusStops({
        //   lng: lng,
        //   lat: lat,
        //   zoom: zoom,
        // }, true);
        updateDisplayedStops({
          lng: lng,
          lat: lat,
          zoom: zoom,
        }, true)
      }}></button>

      <MapboxButtons />

      <div ref={mapContainer} className="map-container" />
      {/* <button class="mapboxgl-ctrl-geolocate mapboxgl-ctrl-geolocate-active" type="button" aria-label="Find my location" aria-pressed="true"><span class="mapboxgl-ctrl-icon" aria-hidden="true" title="Find my location"></span></button> */}
    </div>
  );
}

export default MapboxMap;