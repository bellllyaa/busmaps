import React, { useState, useEffect } from "react";
import * as MdDirections from "react-icons/md"

import './DeparturesTable.css';

const PROXY_URL = "http://localhost:8080/?url=";
const HEROKU_PROXY_URL = "https://bypass-cors-error-server.herokuapp.com/?url=";

function DeparturesTable(props) {
  const [busStop, setBusStop] = useState();

  const redirectFunc = (busStopId) => {
    document.location.href=`http://api.zdiz.gdynia.pl/pt/delays?stopId=${busStopId}`;
  }

  const convertArrivingTime = (estimatedTime, theoreticalTime, headsign) => {
    const timeNow = new Date();
    let theNextDay = new Date();
    theNextDay.setDate(timeNow.getDate() + 1)

    //console.log(timeNow.getHours())
    //console.log(timeNow.getHours() == "22")
    //console.log(theNextDay.getDate())

    const busRealTime = new Date(timeNow.getFullYear(), timeNow.getMonth(), (timeNow.getHours() == "23" && estimatedTime.slice(0,2) == "00" ? theNextDay.getDate() : timeNow.getDate()), estimatedTime.slice(0,2), estimatedTime.slice(3,))
    const busPlanTime = new Date(timeNow.getFullYear(), timeNow.getMonth(), (timeNow.getHours() == "23" && theoreticalTime.slice(0,2) == "00" ? theNextDay.getDate() : timeNow.getDate()), theoreticalTime.slice(0,2), theoreticalTime.slice(3,))

    console.log(timeNow)
    console.log(busRealTime)
    console.log(busPlanTime)
    
    const differenceRealNow = Math.floor((busRealTime - timeNow)/1000/60)
    const differencePlanNow = Math.floor((busPlanTime - timeNow)/1000/60)
    console.log(differenceRealNow)
    console.log(differencePlanNow)
    
    let status = ""
    if (differenceRealNow - differencePlanNow > 0) status = "bus-delayed"
    else if (differenceRealNow - differencePlanNow < 0) status = "bus-early"
    else status = "bus-on_time"

    return (
      <>
        <td>
          <div className="bus__direction">
            <MdDirections.MdDirectionsBus id="bus-icon" />
            <p id="headsign">{headsign}</p>
            {status == "bus-delayed" ? <p className={status}>Delayed {differenceRealNow - differencePlanNow} min • {<s>{theoreticalTime}</s>}</p> : (status == "bus-early" ? <p className={status}>Early {differencePlanNow - differenceRealNow} min • {<s>{theoreticalTime}</s>}</p> : <p className={status}>On time • {estimatedTime}</p>)}
          </div>
        </td>
        <td>
          <div className="bus__arriving-time">
            <p>{differenceRealNow >= 1 ? <span className={status}>{differenceRealNow} min</span> : <span className={status}>{'Now'}</span>}</p>
            {/* {((differencePlanNow != differenceRealNow) && (differenceRealNow > 1) && (differencePlanNow > 0)) ? <span><s>{differencePlanNow + " min"}</s></span> : <></>} */}
          </div>
          {/* <div>
            <b className="live">{estimatedTime}</b>
            {theoreticalTime !== estimatedTime ? <s>{theoreticalTime}</s> : null}
          </div> */}
        </td>
      </>
    )
  }

  const getRouteShortName = (routeId) => props.routes.find(r => r.routeId === routeId)?.routeShortName;

  const createTable = (busStop) => {
    if (busStop && busStop.delay[0]) {
      console.log("createTable(): " + props.busStopId);
      return (
        busStop.delay.map((s) => (
          <tr key={s.trip}>
            <td>
              <div className="bus-short-name">
                <p>{getRouteShortName(s.routeId)}</p>
              </div>
            </td>
            {convertArrivingTime(s.estimatedTime, s.theoreticalTime, s.headsign)}
          </tr>
        ))
      )
    }
  }

  // Updating every x seconds
  useEffect(() => {
    function loadBusStopInfo() {
      console.log("loadBusStopInfo(): " + props.busStopId);
      fetch(HEROKU_PROXY_URL + `http://api.zdiz.gdynia.pl/pt/delays?stopId=${props.busStopId}`)
        .then(response => response.json())
        .then(data => {
          setBusStop(data);
          console.log(data);
        })
    }

    console.log("First loading: " + props.busStopId);

    if (props.busStopId && props.routes) {
      loadBusStopInfo();
      const interval = setInterval(() => loadBusStopInfo(), 10000)
      return () => {
        clearInterval(interval);
      }
    }
  }, [])

  return (
    <div>
      {/* <div className="bus-stop__name">
        <p>{props.busStopName ? <h2>{props.busStopName}:</h2> : null}</p>
      </div> */}
      <table id="departures-table">
        <tbody>
          {createTable(busStop)}
        </tbody>
      </table>
    </div>
  )
}

export default DeparturesTable;