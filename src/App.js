import React, { useState, useEffect } from "react";

import Home from "./pages/Home";

import trips from "./data/trips.json";
import routes from "./data/routes.json";

const LOCAL_URL = "http://localhost:8080/?url=";
const HEROKU_PROXY_URL = "https://bypass-cors-error-server.herokuapp.com/?url=";
const GOOGLE_PROXY_URL = "https://bypass-cors-server.ew.r.appspot.com/?url=";
export const PROXY_URL = LOCAL_URL;

function App() {
  // let busStopAllDepartures = [];
  // fetch("http://api.zdiz.gdynia.pl/pt/stop_times")
  //       .then(response => response.json())
  //       .then(data => {
  //         // console.log(data);
  //         data.map((e) => {
  //           if (e.stopId == 33180) {
  //             e.routeId = trips.find(t => t.tripId === e.tripId)?.routeId;
  //             e.routeShortName = routes.find(r => r.routeId === e.routeId)?.routeShortName;
  //             if (e.routeShortName === "R") {
  //               busStopAllDepartures.push(e)
  //             }
  //             // console.log(e);
  //           }
  //         })
  //         console.log(busStopAllDepartures);
  //       })

  // fetch("http://localhost:8080/?bus-stop-id-static=33180")
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}