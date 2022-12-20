import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup, useMap, circle } from "react-leaflet";
import L from 'leaflet';
import { Button } from "@mui/material";

import "./Map.css";
import { useToggleDrawer, useBusStop } from "../../pages/Home";

import zkmBusStops from "./data/zkm-bus-stops.json";
import routes from "./data/routes.json";

function Map () {
  const {toggleDrawer, setToggleDrawer} = useToggleDrawer();
  const {busStop, setBusStop} = useBusStop();
  console.log(toggleDrawer);
  console.log(busStop);

  const setToggleDrawerFunc = (value, busStop) => {
    setToggleDrawer(value);
    setBusStop(busStop);
    console.log(busStop.stopName);
  };

  const setToggleDrawerOpen = () => {
    setToggleDrawer(true);
  };

  function ButtonElement () {
    return (
      <Button type="button" onClick={setToggleDrawerOpen}>
        Press
      </Button>
    )
  }

  // Get user's location
  function LocationMarker() {
    const [position, setPosition] = useState(null);
    const [bbox, setBbox] = useState([]);

    const map = useMap();
    console.log(map);

    useEffect(() => {
      map.locate().on("locationfound", function (e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        const radius = e.accuracy;
        const circle = L.circle(e.latlng, radius);
        circle.addTo(map);
        setBbox(e.bounds.toBBoxString().split(","));
      });
    }, [map]);

    // return position === null ? null : (
    //   <Marker position={position}>
    //     <Popup>
    //       You are here. <br />
    //       Map bbox: <br />
    //       <b>Southwest lng</b>: {bbox[0]} <br />
    //       <b>Southwest lat</b>: {bbox[1]} <br />
    //       <b>Northeast lng</b>: {bbox[2]} <br />
    //       <b>Northeast lat</b>: {bbox[3]}
    //     </Popup>
    //   </Marker>
    // );
  }

  return (
    <MapContainer
      center={[54.4696210, 18.5001898]}
      zoom={16}
      scrollWheelZoom={true}
      zoomSnap={0.5}
      // style={{height: "80vh"}}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <Marker position={[54.4729600, 18.4952490]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}

      <LocationMarker />
      {zkmBusStops.map((busStop) => (
        <Marker
          key={busStop.stopId}
          position={[busStop.stopLat, busStop.stopLon]}
          closeOnEscapeKey={true}
          eventHandlers={{
            click: () => {
              setToggleDrawerFunc(true, busStop);
            }
          }}
        >
          {/* <Popup
            pane={"popupPane"}
            maxWidth={400}
            maxHeight={300}
          >
            <div>
              <div className="bus-stop__name">
                <h2>{busStop.stopName}:</h2>
              </div>
              {callDeparturesTable(busStop.stopId, busStop.stopName)}
              <CallDeparturesTable
                busStopId={busStop.stopId}
                busStopName={busStop.stopName}
              />
            </div>
          </Popup> */}

        </Marker>
      ))}
      {/* <LocationMarker /> */}
    </MapContainer>
  )
}

export default Map;