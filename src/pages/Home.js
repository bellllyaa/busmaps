import React, { createContext, useContext, useState } from "react";

import Map from "../components/Map/Map";
import SwipeableEdgeDrawer from "../components/DesignElements/SwipeableEdgeDrawer";

import "./Home.css";

const ToggleDrawerContext = createContext(null);
const BusStopContext = createContext(null);

function Home () {
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [busStop, setBusStop] = useState(null);

  return (
    <div>
      <ToggleDrawerContext.Provider value={{toggleDrawer, setToggleDrawer}}>
        <BusStopContext.Provider value={{busStop, setBusStop}}>
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