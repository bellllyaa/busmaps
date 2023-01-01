import React, { useState, useEffect } from "react";
import * as MdDirections from "react-icons/md"

import './DeparturesTable.css';

const LOCAL_URL = "http://localhost:8080";
const HEROKU_PROXY_URL = "https://bypass-cors-error-server.herokuapp.com";
const GOOGLE_PROXY_URL = "https://bypass-cors-server.ew.r.appspot.com";
const PROXY_URL = GOOGLE_PROXY_URL;

function DeparturesTable(props) {
  const [busStop, setBusStop] = useState();

  const convertArrivingTime = (status, estimatedTime, theoreticalTime, headsign) => {
    const timeNow = new Date();
    let timeTomorrow = new Date();
    timeTomorrow.setDate(timeTomorrow.getDate() + 1);
    let timeYesterday = new Date();
    timeYesterday.setDate(timeNow.getDate() - 1);

    // console.log(timeNow);
    // console.log(timeTomorrow);
    // console.log(timeYesterday);

    if (status === "REALTIME") {

      let busRealTime;
      let busPlanTime;

      if ((timeNow.getHours() == "22" || timeNow.getHours() == "23") && (estimatedTime.slice(0, 2) == "00" || estimatedTime.slice(0, 2) == "01")) {
        busRealTime = new Date(timeTomorrow.getFullYear(), timeTomorrow.getMonth(), timeTomorrow.getDate(), estimatedTime.slice(0, 2), estimatedTime.slice(3, 5));
      } else if ((timeNow.getHours() == "00" || timeNow.getHours() == "01") && (estimatedTime.slice(0, 2) == "22" || estimatedTime.slice(0, 2) == "23")) {
        busRealTime = new Date(timeYesterday.getFullYear(), timeYesterday.getMonth(), timeYesterday.getDate(), estimatedTime.slice(0, 2), estimatedTime.slice(3, 5));
      } else {
        busRealTime = new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate(), estimatedTime.slice(0, 2), estimatedTime.slice(3, 5));
      }

      if ((timeNow.getHours() == "22" || timeNow.getHours() == "23") && (theoreticalTime.slice(0, 2) == "00" || theoreticalTime.slice(0,2) == "01")) {
        busPlanTime = new Date(timeTomorrow.getFullYear(), timeTomorrow.getMonth(), timeTomorrow.getDate(), theoreticalTime.slice(0, 2), theoreticalTime.slice(3, 5))
      } else if ((timeNow.getHours() == "00" || timeNow.getHours() == "01") && (theoreticalTime.slice(0, 2) == "22" || theoreticalTime.slice(0, 2) == "23")) {
        busPlanTime = new Date(timeYesterday.getFullYear(), timeYesterday.getMonth(), timeYesterday.getDate(), theoreticalTime.slice(0, 2), theoreticalTime.slice(3, 5))
      } else {
        busPlanTime = new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate(), theoreticalTime.slice(0, 2), theoreticalTime.slice(3, 5))
      }

      // Debugging
      // console.log("Debugging:");
      // const tryEstimatedTime = "00:00";
      // const tryTheoreticalTime = "23:58";
      // let tryBusRealTime;
      // let tryBusPlanTime;

      // if ((timeNow.getHours() == "22" || timeNow.getHours() == "23") && (tryEstimatedTime.slice(0,2) == "00" || tryEstimatedTime.slice(0,2) == "01")) {
      //   tryBusRealTime = new Date(timeTomorrow.getFullYear(), timeTomorrow.getMonth(), timeTomorrow.getDate(), tryEstimatedTime.slice(0, 2), tryEstimatedTime.slice(3, 5));
      // } else if ((timeNow.getHours() == "00" || timeNow.getHours() == "01") && (tryEstimatedTime.slice(0, 2) == "22" || tryEstimatedTime.slice(0, 2) == "23")) {
      //   tryBusRealTime = new Date(timeYesterday.getFullYear(), timeYesterday.getMonth(), timeYesterday.getDate(), tryEstimatedTime.slice(0, 2), tryEstimatedTime.slice(3, 5));
      // } else {
      //   tryBusRealTime = new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate(), tryEstimatedTime.slice(0, 2), tryEstimatedTime.slice(3, 5));
      // }

      // if ((timeNow.getHours() == "22" || timeNow.getHours() == "23") && (tryTheoreticalTime.slice(0,2) == "00" || tryTheoreticalTime.slice(0,2) == "01")) {
      //   tryBusPlanTime = new Date(timeTomorrow.getFullYear(), timeTomorrow.getMonth(), timeTomorrow.getDate(), tryTheoreticalTime.slice(0, 2), tryTheoreticalTime.slice(3, 5))
      // } else if ((timeNow.getHours() == "00" || timeNow.getHours() == "01") && (tryTheoreticalTime.slice(0, 2) == "22" || tryTheoreticalTime.slice(0, 2) == "23")) {
      //   tryBusPlanTime = new Date(timeYesterday.getFullYear(), timeYesterday.getMonth(), timeYesterday.getDate(), tryTheoreticalTime.slice(0, 2), tryTheoreticalTime.slice(3, 5))
      // } else {
      //   tryBusPlanTime = new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate(), tryTheoreticalTime.slice(0, 2), tryTheoreticalTime.slice(3, 5))
      // }

      // console.log(tryBusPlanTime);
      // console.log(tryBusRealTime);

      // console.log(timeNow)
      // console.log(busRealTime)
      // console.log(busPlanTime)
      
      const differenceRealNow = Math.floor((busRealTime - timeNow)/1000/60)
      const differencePlanNow = Math.floor((busPlanTime - timeNow)/1000/60)
      // console.log(differenceRealNow)
      // console.log(differencePlanNow)
      
      let arriving_status = ""
      if (differenceRealNow - differencePlanNow > 0) arriving_status = "bus-delayed"
      else if (differenceRealNow - differencePlanNow < 0) arriving_status = "bus-early"
      else arriving_status = "bus-on_time"

      return (
        <>
          <td>
            <div className="bus__direction">
              <MdDirections.MdDirectionsBus id="bus-icon" />
              <p id="headsign">{headsign}</p>
              {arriving_status == "bus-delayed" ? <p className={arriving_status}>Opóźnienie o {differenceRealNow - differencePlanNow} min • {<s>{theoreticalTime}</s>}</p> : (arriving_status == "bus-early" ? <p className={arriving_status}>Wcześniej o {differencePlanNow - differenceRealNow} min • {<s>{theoreticalTime}</s>}</p> : <p className={arriving_status}>Na czas • {estimatedTime}</p>)}
            </div>
          </td>
          <td>
            <div className="bus__arriving-time">
              <p>{differenceRealNow >= 1 ? <span className={arriving_status}>{differenceRealNow} min</span> : <span className={arriving_status}>{'Teraz'}</span>}</p>
              {/* {((differencePlanNow != differenceRealNow) && (differenceRealNow > 1) && (differencePlanNow > 0)) ? <span><s>{differencePlanNow + " min"}</s></span> : <></>} */}
            </div>
            {/* <div>
              <b className="live">{estimatedTime}</b>
              {theoreticalTime !== estimatedTime ? <s>{theoreticalTime}</s> : null}
            </div> */}
          </td>
        </>
      )
    } else {

      const busPlanTime = new Date(timeNow.getFullYear(), timeNow.getMonth(), (timeNow.getHours() == "23" && theoreticalTime.slice(0,2) == "00" ? timeTomorrow.getDate() : timeNow.getDate()), theoreticalTime.slice(0,2), theoreticalTime.slice(3,));

      const differencePlanNow = Math.floor((busPlanTime - timeNow)/1000/60);

      let arriving_status = "bus-scheduled";

      return (
        <>
          <td>
            <div className="bus__direction">
              <MdDirections.MdDirectionsBus id="bus-icon" />
              <p id="headsign">{headsign}</p>
              <p className={arriving_status}>Rozkładowo • {theoreticalTime}</p>
            </div>
          </td>
          <td>
            <div className="bus__arriving-time">
              <p>{differencePlanNow >= 1 || differencePlanNow < 0 ? differencePlanNow <= 30 && differencePlanNow >= 0  ? <span className={arriving_status}>{differencePlanNow} min</span> : <span className={arriving_status}>{theoreticalTime}</span> : <span className={arriving_status}>{'Teraz'}</span>}</p>
            </div>
          </td>
        </>
      )
    }
  }

  const getRouteShortName = (routeId) => props.routes.find(r => r.routeId === routeId)?.routeShortName;

  const convertToDate = (departureTime, timeNow) => {
    return new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate(), departureTime.slice(0,2), departureTime.slice(3, 5))
  }
  
  const createTable = (busStop) => {
    if (busStop) {
        console.log("createTable(): " + props.busStopId);
        let busStopDepartures = [];
        const timeNow = new Date();
        const timeTomorrow = new Date();
        timeTomorrow.setDate(timeTomorrow.getDate() + 1)
        console.log(timeTomorrow);

        console.log(props.busStopStatic)

        // for (const busStatic in props.busStopStatic[0]) {
        //   for (countToday; countToday < busStop.delay.length; countToday++) {
        //     if (convertToDate(busStop.delay[countToday].estimatedTime, timeNow) <= convertToDate(props.busStopStatic[0][busStatic].departureTime, timeNow)) {
        //       busStopDepartures.push(busStop.delay[countToday])
        //     } else {
        //       break
        //     }
        //   }
        //   if (Number(busStatic) + 1 === props.busStopStatic[0].length) {
        //     for (countTomorrow; countTomorrow < props.busStopStatic[1].length; countTomorrow++) {}
        //     console.log("WWW")
        //   }
        //   if (convertToDate(props.busStopStatic[0][busStatic].departureTime, timeNow) > timeNow && busStop.delay.find(b => b.routeShortName === props.busStopStatic[0][busStatic].routeShortName && b.theoreticalTime === props.busStopStatic[0][busStatic].departureTime) === undefined && busStopDepartures.length < 99) {
        //     busStopDepartures.push(props.busStopStatic[0][busStatic]);
        //   }
        // }

        if (busStop.delay[0]) {

          let countDynamic = 0;
          let countToday = 0;
          let countTomorrow = 0;

          for (countDynamic; countDynamic < busStop.delay.length + 1; countDynamic++) {

            // console.log("props.busStopStatic[0].length: " + props.busStopStatic[0].length);
            for (countToday; countToday < props.busStopStatic[0].length; countToday++) {
              // console.log("countToday: " + countToday);
              if (convertToDate(props.busStopStatic[0][countToday].departureTime, timeNow) >= timeNow && busStop.delay.find(b => b.routeShortName === props.busStopStatic[0][countToday].routeShortName && b.theoreticalTime === props.busStopStatic[0][countToday].departureTime) === undefined) {
                // console.log(props.busStopStatic[0][countToday]);
                // console.log(props.busStopStatic[0][countToday].departureTime);
                // console.log(countDynamic)
                if (countDynamic === busStop.delay.length || (convertToDate(props.busStopStatic[0][countToday].departureTime, timeNow) < convertToDate(busStop.delay[countDynamic].estimatedTime, timeNow))) {
                  busStopDepartures.push(props.busStopStatic[0][countToday])
                } else {
                  break
                }
              }
            }

            // console.log(Number(countToday))
            // console.log(props.busStopStatic[0].length)
            if (Number(countToday) === props.busStopStatic[0].length) {
              for (countTomorrow; countTomorrow < props.busStopStatic[1].length; countTomorrow++) {
                // console.log("countToday: " + countToday);
                if (busStop.delay.find(b => b.routeShortName === props.busStopStatic[1][countTomorrow].routeShortName && b.theoreticalTime === props.busStopStatic[1][countTomorrow].departureTime) === undefined && convertToDate(props.busStopStatic[1][countTomorrow].departureTime, timeTomorrow) - timeNow < 86400000) {
                  // console.log(props.busStopStatic[1][countTomorrow]);
                  // console.log(props.busStopStatic[1][countTomorrow].departureTime);
                  if (countDynamic === busStop.delay.length || (convertToDate(props.busStopStatic[1][countTomorrow].departureTime, timeTomorrow) < convertToDate(busStop.delay[countDynamic].estimatedTime, busStop.delay[countDynamic].estimatedTime.slice(0, 2) === "00" || busStop.delay[countDynamic].estimatedTime.slice(0, 2) === "01" ? timeTomorrow : timeNow))) {
                    busStopDepartures.push(props.busStopStatic[1][countTomorrow])
                  } else {
                    break
                  }
                }
              }
            }

            if (countDynamic != busStop.delay.length) {
              busStopDepartures.push(busStop.delay[countDynamic]);
            } else {
              console.log();
            }

          }
        } else {
          for (let countToday = 0; countToday < props.busStopStatic[0].length; countToday++) {
            if (convertToDate(props.busStopStatic[0][countToday].departureTime, timeNow) >= timeNow) {
              busStopDepartures.push(props.busStopStatic[0][countToday])
            }
          }
          for (let countTomorrow = 0; countTomorrow < props.busStopStatic[1].length; countTomorrow++) {
            if (convertToDate(props.busStopStatic[1][countTomorrow].departureTime, timeTomorrow) - timeNow < 86400000) {
              busStopDepartures.push(props.busStopStatic[1][countTomorrow])
            }
          }
        }

        // console.log(countDynamic);
        console.log(busStopDepartures);
        console.log("");

        return (
          busStopDepartures.map((b) => (
            <tr key={b.status === "REALTIME" ? b.trip : b.status + b.departureTime + b.tripId}>
              <td>
                <div className={"bus-short-name__" + b.status}>
                  <p>{b.routeShortName}</p>
                </div>
              </td>
              {convertArrivingTime(b.status, b.status === "REALTIME" ? b.estimatedTime : null, b.status === "REALTIME" ? b.theoreticalTime : b.departureTime, b.status === "REALTIME" ? b.headsign : b.stopHeadsign)}
            </tr>
          ))
        )
    }
  }

  // Updating every x seconds
  useEffect(() => {
    function loadBusStopInfo() {
      console.log("loadBusStopInfo(): " + props.busStopId);
      fetch(PROXY_URL + "/redirect?url=" + `http://api.zdiz.gdynia.pl/pt/delays?stopId=${props.busStopId}`)
        .then(response => response.json())
        .then(data => {
          data.delay.forEach((e) => {
            e.routeShortName = getRouteShortName(e.routeId)
          })

          console.log(data)
          setBusStop(data);
          // setBusStop({lastUpdate: "Bruh", delay: [{"id": "T401R10029", "delayInSeconds": 47, "estimatedTime": "03:17", "headsign": "Oksywie Dolne 01", "routeId": 10029, "routeShortName": "N10", "tripId":  401, "status":  "REALTIME", "theoreticalTime": "03:17", "timestamp": "18:25:14", "trip": 4746564, "vehicleCode":3091,  "vehicleId": 143601}]})
        })
    }

    function loadZKMBusStopInfo() {
      console.log("")
      fetch(PROXY_URL + "/trojmiasto?url=" + `https://zkmgdynia.pl/stopsAPI/getDisplay/${props.busStopId}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setBusStop(data);
        })
    }

    console.log("First loading: " + props.busStopId);
    console.log("busStopStatic:")
    console.log(props.busStopStatic)

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