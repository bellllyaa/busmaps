import React, { createContext, useContext, useState, useEffect } from "react";

import MapboxMap from "../components/Map/MapboxMap";
import SwipeableEdgeDrawer from "../components/DesignElements/SwipeableEdgeDrawer";

import "./Home.css";

const ToggleDrawerContext = createContext(null);
const CurrentStopContext = createContext(null);
const CurrentTripContext = createContext(null);

function Home() {
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [currentStop, setCurrentStop] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);

  // const [lastOpenedStops, setLastOpenedStops] = useState(
  //   [...Array(3).keys()].map((index) => ({
  //     lastOpenedStopId: Number(localStorage.getItem("lastOpenedStopId" + index)),
  //     lastOpenedStopName: localStorage.getItem("lastOpenedStopName" + index),
  //   }))
  // );
  // console.log(lastOpenedStops);
  // let lastOpenedStopsStringified = JSON.stringify(lastOpenedStops)
  // console.log(lastOpenedStopsStringified);
  // console.log(JSON.parse(lastOpenedStopsStringified))

  // console.log(window.navigator.userAgent.indexOf("iPhone"))
  // console.log(window.navigator.userAgent.slice(13, 19))

  return (
    <div>
      <ToggleDrawerContext.Provider value={{ toggleDrawer, setToggleDrawer }}>
        <CurrentStopContext.Provider value={{ currentStop, setCurrentStop }}>
          <CurrentTripContext.Provider value={{ currentTrip, setCurrentTrip}}>
            <MapboxMap />
            <SwipeableEdgeDrawer />
          </CurrentTripContext.Provider>
        </CurrentStopContext.Provider>
      </ToggleDrawerContext.Provider>
    </div>
  );
}

export default Home;
export const useToggleDrawer = () => useContext(ToggleDrawerContext);
export const useCurrentStop = () => useContext(CurrentStopContext);
export const useCurrentTrip = () => useContext(CurrentTripContext);