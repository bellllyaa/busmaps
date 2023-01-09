import React, { useState, useEffect } from "react";
import Select from "react-select";

import "./Search.css";
import zkmBusStops from "../Map/data/zkm-bus-stops.json";
import { useToggleDrawer, useBusStop, useLastOpenedStops } from "../../pages/Home";

const createRoutesDropdown = () => {
  if (zkmBusStops) {
    //console.log(busStopsList)
    return (
      zkmBusStops
        .sort((a, b) => a.stopName > b.stopName ? 1 : -1)
        .map((s) => (
          {value: s.stopId, label: s.stopName}
        ))
    )
  }
}

function Search () {
  const {toggleDrawer, setToggleDrawer} = useToggleDrawer();
  const {busStop, setBusStop} = useBusStop();
  // const {lastOpenedStops, setLastOpenedStops} = useLastOpenedStops();

  const [lastOpenedStops, setLastOpenedStops] = useState();

  const onChangeStop = (e) => {
    //console.log(e);
    console.log(e.label);
    console.log(e.value);
    setToggleDrawer(true);
    // document.getElementById("bus-stop__select__dropdown").style.pointerEvents = "none";
    document.getElementById("bus-stop__select__dropdown").style.display = "none";
    setBusStop({stopId: e.value, stopName: e.label});

    localStorage.setItem("lastOpenedStopId0", e.value);
    localStorage.setItem("lastOpenedStopName0", e.label);
  }

  const GetLastOpenedStops = () => {}

  useEffect(() => {
    // console.log("bruh");
    // if (localStorage.getItem("lastOpenedStopId") != null) {
    //   console.log(localStorage.getItem("lastOpenedStopId"));
    //   console.log(localStorage.getItem("lastOpenedStopName"));
    //   if (localStorage.getItem("lastOpenedStopId2") != null) {
    //     console.log(localStorage.getItem("lastOpenedStopId2"));
    //     console.log(localStorage.getItem("lastOpenedStopName2"));
    //     if (localStorage.getItem("lastOpenedStopId3") != null) {
    //       console.log(localStorage.getItem("lastOpenedStopId3"));
    //       console.log(localStorage.getItem("lastOpenedStopName3"));
    //     }
    //   }
    // }
  }, [])

  return (
    <div>
      <div id="bus-stop__select__dropdown">
        <Select
          options={createRoutesDropdown()}
          onChange={onChangeStop}
          placeholder="Szukaj..."
        />
      </div>
      {/* <GetLastOpenedStops key={lastOpenedStops[0].lastOpenedStopId} /> */}
      {/* <button id="options">•••</button> */}
    </div>
  )
}

export default Search;