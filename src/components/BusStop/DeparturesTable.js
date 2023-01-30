import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import * as MdDirections from "react-icons/md";

import './DeparturesTable.css';
import { useToggleDrawer } from "../../pages/Home";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import busIcon from "../../assets/bus.svg";
import busDarkIcon from "../../assets/bus-dark.svg";
import goofyAhh from "../../data/goofy_ahh.json";
import impostorIcon from "../../assets/impostor.svg";
import impostorDarkIcon from "../../assets/impostor-dark.svg";

const LOCAL_URL = "http://localhost:8080";
const HEROKU_PROXY_URL = "https://bypass-cors-error-server.herokuapp.com";
const GOOGLE_PROXY_URL = "https://bypass-cors-server.ew.r.appspot.com";
const PROXY_URL = GOOGLE_PROXY_URL;

function DeparturesTable(props) {
  const theme = useTheme();
  const [busStop, setBusStop] = useState();
  const [displayBusesNum, setDisplayBusesNum] = useState(10);
  const { toggleDrawer, setToggleDrawer } = useToggleDrawer();
  const [goofyAhhNum, setGoofyAhhNum] = useState(Math.floor(Math.random() * goofyAhh.fullHeight.length));

  const convertArrivingTime = (status, estimatedTime, theoreticalTime, headsign) => {
    const timeNow = new Date();
    const timeTomorrow = new Date();
    timeTomorrow.setDate(timeTomorrow.getDate() + 1);
    const timeYesterday = new Date();
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
              {/* {localStorage.getItem("mode") === "ohio" ? <p style={{display: "inline-block", marginRight: "5px"}}>ඞ</p> : <MdDirections.MdDirectionsBus id="bus-icon" />} */}
              {/* {localStorage.getItem("mode") === "ohio" ? <p style={{display: "inline-block", marginRight: "5px"}}>ඞ</p> : <img id="bus-icon" src={theme.palette.mode === "light" ? busDarkIcon : busIcon} alt="Stop icon"></img>} */}
              {localStorage.getItem("mode") === "ohio" ? <img id="bus-icon" src={theme.palette.mode === "light" ? impostorIcon : impostorDarkIcon} alt="Stop icon"></img> : <img id="bus-icon" src={theme.palette.mode === "light" ? busDarkIcon : busIcon} alt="Stop icon"></img>}
              <p id="headsign">{headsign}</p>
              {arriving_status == "bus-delayed" ? <p className={arriving_status}>Opóźnienie o {differenceRealNow - differencePlanNow} min • {<s>{theoreticalTime}</s>}</p> : (arriving_status == "bus-early" ? <p className={arriving_status}>Wcześniej o {differencePlanNow - differenceRealNow} min • {<s>{theoreticalTime}</s>}</p> : <p className={arriving_status}>Na czas • {estimatedTime}</p>)}
            </div>
          </td>
          <td>
            <div className="bus__arriving-time">
              <p>{differenceRealNow >= 1 ? <span className={arriving_status}>{differenceRealNow}<br/>min</span> : <span className={arriving_status}>{'Teraz'}</span>}</p>
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
              {/* {localStorage.getItem("mode") === "ohio" ? <p style={{display: "inline-block", marginRight: "5px"}}>ඞ</p> : <MdDirections.MdDirectionsBus id="bus-icon" />} */}
              {/* {localStorage.getItem("mode") === "ohio" ? <p style={{display: "inline-block", marginRight: "5px"}}>ඞ</p> : <img id="bus-icon" src={theme.palette.mode === "light" ? busDarkIcon : busIcon} alt="Stop icon"></img>} */}
              {localStorage.getItem("mode") === "ohio" ? <img id="bus-icon" src={theme.palette.mode === "light" ? impostorIcon : impostorDarkIcon} alt="Stop icon"></img> : <img id="bus-icon" src={theme.palette.mode === "light" ? busDarkIcon : busIcon} alt="Stop icon"></img>}
              <p id="headsign">{headsign}</p>
              <p className={arriving_status}>Rozkładowo • {theoreticalTime}</p>
            </div>
          </td>
          <td>
            <div className="bus__arriving-time">
              <p>{differencePlanNow >= 1 || differencePlanNow < 0 ? differencePlanNow <= 30 && differencePlanNow >= 0  ? <span className={arriving_status}>{differencePlanNow}<br/>min</span> : <span className={arriving_status}>{theoreticalTime}</span> : <span className={arriving_status}>{'Teraz'}</span>}</p>
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

  const handleClick = (num, action) => {

    const el = document.querySelector(theme.palette.mode === "light" ? ".css-1wr8kee" : ".css-1wk78lo");

    if (action === "to top") {
      el.scroll(0, 0);
      return;
    } else if (action === "to top and roll up") {
      el.scroll(0, 0);
    }

    console.log(num);
    setDisplayBusesNum(num);
    
    // console.log(el.scrollTop);
    // const maxElScrollTop = el.scrollHeight - el.clientHeight - 0.5;
    // console.log(maxElScrollTop);
  }
  
  const createTable = (busStop) => {
    if (busStop) {
        // console.log("createTable(): " + props.busStopId);

        let busStopDepartures = [];

        const timeNow = new Date();
        const timeTomorrow = new Date();
        timeTomorrow.setDate(timeTomorrow.getDate() + 1);
        const timeYesterday = new Date();
        timeYesterday.setDate(timeNow.getDate() - 1);
        // console.log("Time:")
        // console.log(timeNow);
        // console.log(timeTomorrow);
        // console.log(timeYesterday);

        // console.log(props.busStopStatic)

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
              let busRealTime;
              if ((timeNow.getHours() == "22" || timeNow.getHours() == "23") && (busStop.delay[countDynamic].estimatedTime.slice(0, 2) == "00" || busStop.delay[countDynamic].estimatedTime.slice(0, 2) == "01")) {
                busRealTime = new Date(timeTomorrow.getFullYear(), timeTomorrow.getMonth(), timeTomorrow.getDate(), busStop.delay[countDynamic].estimatedTime.slice(0, 2), busStop.delay[countDynamic].estimatedTime.slice(3, 5));
              } else if ((timeNow.getHours() == "00" || timeNow.getHours() == "01") && (busStop.delay[countDynamic].estimatedTime.slice(0, 2) == "22" || busStop.delay[countDynamic].estimatedTime.slice(0, 2) == "23")) {
                busRealTime = new Date(timeYesterday.getFullYear(), timeYesterday.getMonth(), timeYesterday.getDate(), busStop.delay[countDynamic].estimatedTime.slice(0, 2), busStop.delay[countDynamic].estimatedTime.slice(3, 5));
              } else {
                busRealTime = new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate(), busStop.delay[countDynamic].estimatedTime.slice(0, 2), busStop.delay[countDynamic].estimatedTime.slice(3, 5));
              }
              const differenceRealNow = Math.floor((busRealTime - timeNow)/1000/60)

              if (differenceRealNow >=  -1) {
                busStopDepartures.push(busStop.delay[countDynamic]);
              }
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
        // console.log(busStopDepartures);
        // console.log("");

        let busStopDeparturesCut = [];

        for (let i = 0; i < displayBusesNum && i < busStopDepartures.length; i++) {
          busStopDeparturesCut.push(busStopDepartures[i])
        }
        // console.log(busStopDeparturesCut);

        sessionStorage.setItem("stop_info_logs", JSON.stringify([
          new Date(),
          props.busStopId,
          props.busStopName,
          busStop
        ]))

        return (
          <div>

            <table id="departures-table">
              <tbody>
                {busStopDeparturesCut.map((b) => (
                  <tr key={b.status === "REALTIME" ? b.trip : b.status + b.departureTime + b.tripId}>
                    <td>
                      <div className={"bus-short-name__" + b.status}>
                        {localStorage.getItem("mode") === "ohio" && b.routeShortName === "191" ? (
                          <p style={{fontSize: "10px", padding: "5px 0 5px 0"}}>stodziwka</p>
                        ) : (
                          <p>{b.routeShortName}</p>
                        )}
                      </div>
                    </td>
                    {convertArrivingTime(b.status, b.status === "REALTIME" ? b.estimatedTime : null, b.status === "REALTIME" ? b.theoreticalTime : b.departureTime, b.status === "REALTIME" ? b.headsign : b.stopHeadsign)}
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <div className="free-space"></div> */}
            {
              displayBusesNum < busStopDepartures.length
                ? displayBusesNum <= 30
                    ? <div>
                        <button className="departures-list-control-button show-down" onClick={() => {handleClick(displayBusesNum + 10)}} >
                          <img src={arrowLeftIcon} alt="To top button" />
                          Więcej
                        </button>
                        <button className="departures-list-control-button" onClick={() => {handleClick(0, "to top")}}>
                          <img src={arrowLeftIcon} alt="To top button" />
                          Do góry
                        </button>
                        <button className="departures-list-go-to-top-button-floating" onClick={() => {handleClick(0, "to top")}}>
                          <img src={arrowLeftIcon} alt="To top button" />
                        </button>
                      </div>
                    : <div>
                        <button className="departures-list-control-button show-down" onClick={() => {handleClick(busStopDepartures.length)}} >
                          <img src={arrowLeftIcon} alt="To top button" />
                          Wszystkie
                        </button>
                        <button className="departures-list-control-button" onClick={() => {handleClick(10, "to top and roll up")}}>
                          <img src={arrowLeftIcon} alt="To top button" />
                          Do góry
                        </button>
                        <button className="departures-list-go-to-top-button-floating" onClick={() => {handleClick(10, "to top and roll up")}}>
                          <img src={arrowLeftIcon} alt="To top button" />
                        </button>
                      </div>
                : <button className="departures-list-go-to-top-button-floating" onClick={() => {handleClick(10, "to top and roll up")}}>
                    <img src={arrowLeftIcon} alt="To top button" />
                  </button>
            }

            <div id="departures-table__information">
              <p>Informacje o przyjazdach są dostarczane przez <a href="https://zkmgdynia.pl" target="_blank">ZKM Gdynia</a></p>
            </div>

            {localStorage.getItem("mode") === "ohio" ? (
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  left: "0",
                  top: "0",
                  zIndex: "1",
                  opacity: theme.palette.mode === "light" ? "0.2" : "0.15",
                  pointerEvents: "none"
                }}
                src={goofyAhh.fullHeight[goofyAhhNum]}
                // alt="Goofy ahh image"
              ></img>
            ) : null}

          </div>
        )
    }
  }

  // Updating every x seconds
  useEffect(() => {

    function loadBusStopInfo() {
      // console.log("loadBusStopInfo(): " + props.busStopId);
      fetch(PROXY_URL + "/redirect?url=" + `http://api.zdiz.gdynia.pl/pt/delays?stopId=${props.busStopId}`)
        .then(response => response.json())
        .then(data => {
          data.delay.forEach((e) => {
            e.routeShortName = getRouteShortName(e.routeId)
          })

          // console.log(data)
          setBusStop(data);
          // setBusStop({lastUpdate: "Bruh", delay: [{"id": "T401R10029", "delayInSeconds": 47, "estimatedTime": "03:17", "headsign": "Oksywie Dolne 01", "routeId": 10029, "routeShortName": "N10", "tripId":  401, "status":  "REALTIME", "theoreticalTime": "03:17", "timestamp": "18:25:14", "trip": 4746564, "vehicleCode":3091,  "vehicleId": 143601}]})
        })
    }

    // function loadZKMBusStopInfo() {
    //   fetch(PROXY_URL + "/trojmiasto?url=" + `https://zkmgdynia.pl/stopsAPI/getDisplay/${props.busStopId}`)
    //     .then(response => response.json())
    //     .then(data => {
    //       console.log(data);
    //       setBusStop(data);
    //     })
    // }

    console.log("First loading: " + props.busStopId);
    // console.log("busStopStatic:")
    // console.log(props.busStopStatic)

    let lastOpenedStops = JSON.parse(localStorage.getItem("lastOpenedStops"));
    const zkmBusStops = JSON.parse(sessionStorage.getItem("zkmBusStops"));
    let stopLocation = {lng: null, lat: null, zoneName: null};
    if (zkmBusStops != null && zkmBusStops[0]) {
      for (const stop of zkmBusStops) {
        if (Number(stop.stopId) === Number(props.busStopId) && stop.stopName === props.busStopName) {
          stopLocation = {lng: stop.stopLon, lat: stop.stopLat, zoneName: stop.zoneId};
          break;
        }
      }
    }
    // console.log({...stopLocation});
    // console.log(lastOpenedStops);
    if (lastOpenedStops === null) {
      lastOpenedStops = [{stopId: props.busStopId, stopName: props.busStopName, stopProvider: "ZKM Gdynia", ...stopLocation}];
      localStorage.setItem("lastOpenedStops", JSON.stringify(lastOpenedStops));
    } else {
      // localStorage.removeItem("lastOpenedStops");
      for (const stop of lastOpenedStops) {
        // console.log(stop.stopName);
        if (Number(props.busStopId) === Number(stop.stopId)) {
          let index = lastOpenedStops.indexOf(stop);
          if (index !== -1) {
            lastOpenedStops.splice(index, 1);
          }
        }
      }
      lastOpenedStops.unshift({stopId: props.busStopId, stopName: props.busStopName, stopProvider: "ZKM Gdynia", ...stopLocation});
      localStorage.setItem("lastOpenedStops", JSON.stringify(lastOpenedStops.slice(0, 5)));
    }
    console.log(JSON.parse(localStorage.getItem("lastOpenedStops")));
    document.querySelector("#map-update-button").click();

    if (props.busStopId && props.routes) {
      loadBusStopInfo();
      const interval = setInterval(() => loadBusStopInfo(), 10000)
      return () => {
        clearInterval(interval);
      }
    }

  }, [])

  useEffect(() => {
    if (toggleDrawer === false && displayBusesNum > 20) {
      setDisplayBusesNum(10);
    }
  }, [toggleDrawer])

  useEffect(() => {

    // console.log("•")
    // console.log("•")
    // console.log("•")
    // console.log(goofyAhhNum)
    // console.log(goofyAhh.fullHeight.length)
    // console.log("•")
    // console.log("•")
    // console.log("•")

    try {
      const el = document.querySelector(theme.palette.mode === "light" ? ".css-1wr8kee" : ".css-1wk78lo");

      el.addEventListener("scroll", () => {
        const maxElScrollTop = el.scrollHeight - el.clientHeight - 0.5;

        if (el.scrollTop >= maxElScrollTop - 150) {
          try {
            document.getElementsByClassName("departures-list-go-to-top-button-floating")[0].style.display = "none";
          } catch {}
        } else if (el.scrollTop <= 30) {
          try {
            document.getElementsByClassName("departures-list-go-to-top-button-floating")[0].style.display = "none";
          } catch {}
        } else {
          try {
            document.getElementsByClassName("departures-list-go-to-top-button-floating")[0].style.display = "block";
          } catch {}
        }
      })
    } catch {}
  }, [])

  return (
    <div className={theme.palette.mode === "light" ? "" : "departures-table__container-theme-dark"}>
      {/* <div className="bus-stop__name">
        <p>{props.busStopName ? <h2>{props.busStopName}:</h2> : null}</p>
      </div> */}
      {createTable(busStop)}
    </div>
  )
}

export default DeparturesTable;