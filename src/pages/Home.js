import React, { createContext, useContext, useState } from "react";

import Map from "../components/Map/Map";
import SwipeableEdgeDrawer from "../components/DesignElements/SwipeableEdgeDrawer";
import Search from "../components/DesignElements/Search";

import "./Home.css";

const ToggleDrawerContext = createContext(null);
const BusStopContext = createContext(null);

function Home () {

  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [busStop, setBusStop] = useState(null);
  // console.log(window.navigator.userAgent.indexOf("iPhone"))
  // console.log(window.navigator.userAgent.slice(13, 19))

  return (
    <div>
      <ToggleDrawerContext.Provider value={{toggleDrawer, setToggleDrawer}}>
        <BusStopContext.Provider value={{busStop, setBusStop}}>
          <Search />
          <Map />
          <SwipeableEdgeDrawer />
        </BusStopContext.Provider>
      </ToggleDrawerContext.Provider>
    </div>
  )
}

export default Home;
export const useToggleDrawer = () => useContext(ToggleDrawerContext);
export const useBusStop = () => useContext(BusStopContext);