import React, { useState, useEffect } from "react";
import Skeleton from '@mui/material/Skeleton';

import DeparturesTable from "../BusStop/DeparturesTable";

import routes from "../../data/routes.json";

const LOCAL_URL = "http://localhost:8080";
const HEROKU_PROXY_URL = "https://bypass-cors-error-server.herokuapp.com";
const GOOGLE_PROXY_URL = "https://bypass-cors-server.ew.r.appspot.com";
const PROXY_URL = GOOGLE_PROXY_URL;

function CallDeparturesTable(props) {

  const [busStopStatic, setBusStopStatic] = useState();

  function Loading () {
    return (
      <Skeleton variant="rectangular" height="10%" width="90%" style={{margin: "5%", marginBottom: 0, borderRadius: "10px"}} />
    )
  }

  useEffect(() => {
    console.log("fetch")
    console.log(new Date());

    fetch(PROXY_URL + `/trojmiasto?bus-stop-id-static=${props.busStopId}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setBusStopStatic(data);
      })
  }, [])

  return (
    <>
      {busStopStatic != undefined ? <DeparturesTable
        key={props.busStopId}
        busStopId={props.busStopId}
        busStopName={props.busStopName}
        routes={routes}
        busStopStatic={busStopStatic}
      /> : <><Loading /><Loading /><Loading /><Loading /><Loading /></>}
    </>
  )
}

export default CallDeparturesTable;