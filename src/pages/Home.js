import React, { createContext, useContext, useState } from "react";

import Map from "../components/Map/Map";
import SwipeableEdgeDrawer from "../components/DesignElements/SwipeableEdgeDrawer";
import Search from "../components/DesignElements/Search";

import "./Home.css";

const ToggleDrawerContext = createContext(null);
const BusStopContext = createContext(null);
const LastOpenedStopsContext = createContext(null);

function Home() {
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [busStop, setBusStop] = useState(null);

  const [lastOpenedStops, setLastOpenedStops] = useState(
    [...Array(3).keys()].map((index) => ({
      lastOpenedStopId: localStorage.getItem("lastOpenedStopId" + index),
      lastOpenedStopName: localStorage.getItem("lastOpenedStopName" + index),
    }))
  );
  console.log(lastOpenedStops);

  // console.log(window.navigator.userAgent.indexOf("iPhone"))
  // console.log(window.navigator.userAgent.slice(13, 19))

  return (
    <div>
      <ToggleDrawerContext.Provider value={{ toggleDrawer, setToggleDrawer }}>
        <BusStopContext.Provider value={{ busStop, setBusStop }}>
          <LastOpenedStopsContext.Provider
            value={{ lastOpenedStops, setLastOpenedStops }}
          >
            <div style={{height: "80vh"}}>
              <Search />
              <Map />
              <SwipeableEdgeDrawer />
            </div>
          </LastOpenedStopsContext.Provider>
        </BusStopContext.Provider>
      </ToggleDrawerContext.Provider>
    </div>
  );
}

export default Home;
export const useToggleDrawer = () => useContext(ToggleDrawerContext);
export const useBusStop = () => useContext(BusStopContext);
export const useLastOpenedStops = () => useContext(LastOpenedStopsContext);
