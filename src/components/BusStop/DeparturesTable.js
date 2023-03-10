import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import * as MdDirections from "react-icons/md";
import moment from "moment-timezone";

import { useToggleDrawer, useCurrentStop } from "../../pages/Home";
import Loading from "../DesignElements/Loading";

import './DeparturesTable.css';
import arrowLeftIcon from "../../assets/arrow-left.svg";
import busIcon from "../../assets/bus.svg";
import busDarkIcon from "../../assets/bus-dark.svg";
import tramIcon from "../../assets/tram.svg";
import tramDarkIcon from "../../assets/tram-dark.svg";
import trainIcon from "../../assets/train.svg";
import trainDarkIcon from "../../assets/train-dark.svg";
import impostorIcon from "../../assets/impostor.svg";
import impostorDarkIcon from "../../assets/impostor-dark.svg";
import goofyAhh from "../../data/goofy_ahh.json";

const LOCAL_URL = "http://localhost:8080";
const GOOGLE_PROXY_URL = "https://bypass-cors-server.ew.r.appspot.com";
const PROXY_URL = GOOGLE_PROXY_URL;

function DeparturesTable(props) {
  const theme = useTheme();
  const [busStop, setBusStop] = useState();
  const [displayBusesNum, setDisplayBusesNum] = useState(10);
  const { toggleDrawer, setToggleDrawer } = useToggleDrawer();
  const { currentStop, setCurrentStop } = useCurrentStop();
  const [currentStopDeparturesArr, setCurrentStopDeparturesArr] = useState(null);
  const [goofyAhhNum, setGoofyAhhNum] = useState(Math.floor(Math.random() * goofyAhh.fullHeight.length));

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

  useEffect(() => {
    if (toggleDrawer === false && displayBusesNum > 20) {
      setDisplayBusesNum(10);
    }
  }, [toggleDrawer])

  useEffect(() => {

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

  // New

  const convertArrivingTime = (departure) => {

    const dateNow = moment().tz("Europe/Warsaw")

    let vehicleIcon
    if (localStorage.getItem("mode") === "ohio") {
      vehicleIcon = theme.palette.mode === "light" ? impostorIcon : impostorDarkIcon
    } else if (departure.routeType === "train") {
      vehicleIcon = theme.palette.mode === "light" ? trainDarkIcon : trainIcon
    } else if (departure.routeType === "tram") {
      vehicleIcon = theme.palette.mode === "light" ? tramDarkIcon : tramIcon
    } else {
      vehicleIcon = theme.palette.mode === "light" ? busDarkIcon : busIcon
    }

    if (departure.status === "REALTIME") {

      const estimatedTime = moment(departure.estimatedTime)
      const theoreticalTime = moment(departure.theoreticalTime)
      
      const differenceRealNow = Math.floor((estimatedTime - dateNow)/1000/60)
      const differencePlanNow = Math.floor((theoreticalTime - dateNow)/1000/60)
      
      let arriving_status
      if (differenceRealNow - differencePlanNow > 0) {
        arriving_status = "bus-late"
      } else if (differenceRealNow - differencePlanNow < 0) {
        arriving_status = "bus-early"
      } else {
        arriving_status = "bus-on_time"
      }

      return (
        <>
          <td>
            <div className="bus__direction">
              {<img id="bus-icon" src={vehicleIcon} alt="Stop icon"></img>}

              <p id="headsign">{departure.headsign}</p>

              {arriving_status == "bus-late" ? (
                <p className={arriving_status}>
                  Opóźnienie o {differenceRealNow - differencePlanNow} min
                  {differenceRealNow <= 60 ? <>{" • "}<s>{theoreticalTime.format('HH:mm')}</s></> : <></>}
                </p>
              ) : arriving_status == "bus-early" ? (
                <p className={arriving_status}>
                  Wcześniej o {differencePlanNow - differenceRealNow} min
                  {differenceRealNow <= 60 ? <>{" • "}<s>{theoreticalTime.format('HH:mm')}</s></> : <></>}
                </p>
              ) : (
                <p className={arriving_status}>
                  Na czas
                  {differenceRealNow <= 60 ? ` • ${theoreticalTime.format('HH:mm')}` : <></>}
                </p>
              )}
            </div>
          </td>
          <td>
            <div className="bus__arriving-time">
              <p>
                {differenceRealNow > 60 ? (
                  <span className={arriving_status}>{estimatedTime.format("HH:mm")}</span>
                ) : differenceRealNow >= 1 ? (
                  <span className={arriving_status}>
                    {differenceRealNow}
                    <br />
                    min
                  </span>
                ) : differenceRealNow > -1 ? (
                  <span className={arriving_status}>{"Teraz"}</span>
                ) : (
                  <span className={arriving_status} style={{whiteSpace: "nowrap"}}>
                    {Math.abs(differenceRealNow)}
                    <br />
                    min temu
                  </span>
                )}
              </p>
            </div>
          </td>
        </>
      );
    } else {

      const theoreticalTime = moment(departure.theoreticalTime)

      const differencePlanNow = Math.floor((theoreticalTime - dateNow)/1000/60)

      const arriving_status = "bus-scheduled";

      return (
        <>
          <td>
            <div className="bus__direction">
              {<img id="bus-icon" src={vehicleIcon} alt="Stop icon"></img>}
              <p id="headsign">{departure.headsign}</p>
              <p className={arriving_status}>
                Rozkładowo
                {differencePlanNow <= 60 ? ` • ${theoreticalTime.format("HH:mm")}` : <></>}
              </p>
            </div>
          </td>
          <td>
            <div className="bus__arriving-time">
              <p>
                {differencePlanNow > 60 ? (
                  <span className={arriving_status}>{theoreticalTime.format("HH:mm")}</span>
                ) : differencePlanNow >= 1 ? (
                  <span className={arriving_status}>
                    {differencePlanNow}
                    <br />
                    min
                  </span>
                ) : differencePlanNow > -1 ? (
                  <span className={arriving_status}>{"Teraz"}</span>
                ) : (
                  <span className={arriving_status} style={{whiteSpace: "nowrap"}}>
                    {Math.abs(differencePlanNow)}
                    <br />
                    min temu
                  </span>
                )}
              </p>
            </div>
          </td>
        </>
      );
    }

  }

  const displayDeparturesTable = (departuresArr) => {

    // const datePreviousDay = moment().tz("Europe/Warsaw").add(-1, "days");
    const dateNow = moment().tz("Europe/Warsaw"); //.format('YYYY-MM-DD HH:mm:ss')
    // const dateNextDay = moment().tz("Europe/Warsaw").add(1, "days"); //.format('YYYY-MM-DD HH:mm:ss')
    // const dates = [datePreviousDay, dateNow, dateNextDay];
    
    // for (const date of dates) {
    //   console.log(date.format('YYYY-MM-DD HH:mm:ss Z'))
    // }

    const dateMin = moment().tz("Europe/Warsaw").add(-2, "minutes");
    const dateMax = moment().tz("Europe/Warsaw").add(1, "days");

    const departuresArrCut = [];
    for (const element of departuresArr) {
      if (departuresArrCut.length >= displayBusesNum) {
        break
      }
      if (
        dateMin < (element.status === "REALTIME" ? moment(element.estimatedTime) : moment(element.theoreticalTime))
        && (element.status === "REALTIME" ? moment(element.estimatedTime) : moment(element.theoreticalTime)) < dateMax
      ) {
        departuresArrCut.push(element)
      }
    }
    console.log("departuresArr:")
    console.log(departuresArr)
    console.log("departuresArrCut:")
    console.log(departuresArrCut)

    sessionStorage.setItem("stop_info_logs", JSON.stringify({
      date: dateNow.format('YYYY-MM-DD HH:mm:ss Z'),
      currentStop: currentStop,
      departures: departuresArr
    }))

    if (localStorage.getItem("mode") === "ohio") {
      departuresArrCut.forEach(element => {
        if (element.routeName === "191") {
          element.routeName = "stodziwka"
          element.ohioStyle = {fontSize: "11px", padding: "6px 2px", marginLeft: "0", transform: "translateX(15px)"}
        }
      })
    }

    return (
      <div>
        <table id="departures-table">
          <tbody>
            {departuresArrCut.map((departure) => (
              <tr
                key={`${departure.routeId}_${departure.routeName}_${departure.tripId}_${departure.theoreticalTime}`}
                style={
                  Math.floor(
                    (moment(
                      departure.status === "REALTIME"
                        ? departure.estimatedTime
                        : departure.theoreticalTime
                    ) -
                      dateNow) /
                      1000 /
                      60
                  ) < 0
                    ? { opacity: "50%" }
                    : {}
                }
              >
                <td>
                  <div className={"bus-short-name__" + departure.status}>
                    <p
                      style={
                        departure.ohioStyle
                          ? departure.ohioStyle
                          : departure.color
                          ? departure.color
                          : {}
                      }
                    >
                      {departure.routeName}
                    </p>
                  </div>
                </td>
                {convertArrivingTime(departure)}
              </tr>
            ))}
          </tbody>
        </table>

        {displayBusesNum < departuresArr.length ? (
          displayBusesNum <= 30 ? (
            <div>
              <button
                className="departures-list-control-button show-down"
                onClick={() => {
                  handleClick(displayBusesNum + 10);
                }}
              >
                <img src={arrowLeftIcon} alt="To top button" />
                Więcej
              </button>
              <button
                className="departures-list-control-button"
                onClick={() => {
                  handleClick(0, "to top");
                }}
              >
                <img src={arrowLeftIcon} alt="To top button" />
                Do góry
              </button>
              <button
                className="departures-list-go-to-top-button-floating"
                onClick={() => {
                  handleClick(0, "to top");
                }}
              >
                <img src={arrowLeftIcon} alt="To top button" />
              </button>
            </div>
          ) : (
            <div>
              <button
                className="departures-list-control-button show-down"
                onClick={() => {
                  handleClick(departuresArr.length);
                }}
              >
                <img src={arrowLeftIcon} alt="To top button" />
                Wszystkie
              </button>
              <button
                className="departures-list-control-button"
                onClick={() => {
                  handleClick(10, "to top and roll up");
                }}
              >
                <img src={arrowLeftIcon} alt="To top button" />
                Do góry
              </button>
              <button
                className="departures-list-go-to-top-button-floating"
                onClick={() => {
                  handleClick(10, "to top and roll up");
                }}
              >
                <img src={arrowLeftIcon} alt="To top button" />
              </button>
            </div>
          )
        ) : (
          <button
            className="departures-list-go-to-top-button-floating"
            onClick={() => {
              handleClick(10, "to top and roll up");
            }}
          >
            <img src={arrowLeftIcon} alt="To top button" />
          </button>
        )}

        <div id="departures-table__information">
          <p>
            Informacje o przyjazdach są dostarczane przez{" "}
            {currentStop.providers.map(provider => {

              const index = currentStop.providers.indexOf(provider)
              let divider = ""
              if (index === currentStop.providers.length-1 && index !== 0) {
                divider = " i "
              } else if (index !== 0) {
                divider = ", "
              }
              let link = ""
              if (provider.stopProvider === "ZTM Gdańsk") {
                link = "https://ztm.gda.pl"
              } else if (provider.stopProvider === "ZKM Gdynia") {
                link = "https://zkmgdynia.pl"
              } else if (provider.stopProvider === "SKM Trójmiasto") {
                link = "https://www.skm.pkp.pl"
              } else if (provider.stopProvider === "PolRegio") {
                link = "https://polregio.pl"
              } else if (provider.stopProvider === "PKP Intercity") {
                link = "https://www.intercity.pl"
              }

              return (
                <>
                  {divider}<a href={link} target="_blank">{provider.stopProvider}</a>
                </>
              )
            })}
          </p>
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
              pointerEvents: "none",
            }}
            src={goofyAhh.fullHeight[goofyAhhNum]}
            // alt="Goofy ahh image"
          ></img>
        ) : null}
      </div>
    );

  }

  // Updating every 10 seconds
  useEffect(() => {
    if (currentStop === null) {
      return
    }

    function loadDepartures() {
      // console.log(currentStop)
      fetch(PROXY_URL + "/get-departures",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentStop),
      })
        .then(response => response.json())
        .then(data => {
          setCurrentStopDeparturesArr(data);
        })
    }

    console.log("First loading:", currentStop);

    let lastOpenedStops = JSON.parse(localStorage.getItem("lastOpenedStops"));
    // const stops = JSON.parse(sessionStorage.getItem("stops"));

    if (lastOpenedStops === null) {
      lastOpenedStops = [currentStop];
      localStorage.setItem("lastOpenedStops", JSON.stringify(lastOpenedStops));
    } else {
      
      for (const stop of lastOpenedStops) {
        if (currentStop.stopName === stop.stopName) {
          let index = lastOpenedStops.indexOf(stop);
          if (index !== -1) {
            lastOpenedStops.splice(index, 1);
          }
        }
      }
      lastOpenedStops.unshift(currentStop);
      localStorage.setItem("lastOpenedStops", JSON.stringify(lastOpenedStops.slice(0, 5)));
    }
    console.log("lastOpenedStops:")
    console.log(JSON.parse(localStorage.getItem("lastOpenedStops")));
    console.log("favoriteStops:")
    console.log(JSON.parse(localStorage.getItem("favoriteStops")));
    document.querySelector("#map-update-button").click();

    loadDepartures();
    const interval = setInterval(() => loadDepartures(), 10000)
    return () => {
      clearInterval(interval);
    }
    
  }, [currentStop])

  return (
    <div className={theme.palette.mode === "light" ? "departures-table__container" : "departures-table__container-theme-dark"}>

      {currentStopDeparturesArr !== null ? (
        displayDeparturesTable(currentStopDeparturesArr)
      ) : (
        <><Loading /><Loading /><Loading /><Loading /><Loading /></>
      )}

    </div>
  )
}

export default DeparturesTable;