import React from "react";
import Select from "react-select";

import "./Search.css";
import zkmBusStops from "../Map/data/zkm-bus-stops.json";
import { useToggleDrawer, useBusStop } from "../../pages/Home";

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

  const onChangeStop = (e) => {
    //console.log(e);
    console.log(e.label);
    console.log(e.value);
    setToggleDrawer(true);
    document.getElementById("bus-stop__select__dropdown").style.pointerEvents = "none";
    setBusStop({stopId: e.value, stopName: e.label});

    localStorage.setItem("lastOpenedStopId", e.value);
    localStorage.setItem("lastOpenedStopName", e.label);
  }

  return (
    <div>
      <div id="bus-stop__select__dropdown">
        <Select
          options={createRoutesDropdown()}
          onChange={onChangeStop}
          placeholder="Szukaj..."
        />
      </div>
      {/* <button id="options">•••</button> */}
    </div>
  )
}

export default Search;