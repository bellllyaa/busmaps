import React, { createContext, useContext, useState } from "react";

import MapboxMap from "../components/Map/MapboxMap";
import SwipeableEdgeDrawer from "../components/DesignElements/SwipeableEdgeDrawer";

import "./Home.css";

const ToggleDrawerContext = createContext(null);
const BusStopContext = createContext(null);
const CurrentStopContext = createContext(null);

function Home() {
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [busStop, setBusStop] = useState(null);
  const [currentStop, setCurrentStop] = useState(null);

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
        <BusStopContext.Provider value={{ busStop, setBusStop }}>
          <CurrentStopContext.Provider value={{ currentStop, setCurrentStop }}>
            <MapboxMap />
            <SwipeableEdgeDrawer />
          </CurrentStopContext.Provider>
        </BusStopContext.Provider>
      </ToggleDrawerContext.Provider>
    </div>
  );
}

export default Home;
export const useToggleDrawer = () => useContext(ToggleDrawerContext);
export const useBusStop = () => useContext(BusStopContext);
export const useCurrentStop = () => useContext(CurrentStopContext);
