import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import moment from "moment-timezone";

import { useToggleDrawer, useCurrentStop, useCurrentTrip } from "../../pages/Home";
import Loading from "../DesignElements/Loading";

import './StopsInTrip.css';
import arrowLeftIcon from "../../assets/arrow-left.svg";

const LOCAL_URL = "http://localhost:8080";
const GOOGLE_PROXY_URL = "https://bypass-cors-server.ew.r.appspot.com";
const AZURE_PROXY_URL = "https://busmaps-server.azurewebsites.net"
const PROXY_URL = AZURE_PROXY_URL;

function StopsInTrip() {

  const theme = useTheme();
  const { toggleDrawer, setToggleDrawer } = useToggleDrawer();
  const { currentTrip, setCurrentTrip } = useCurrentTrip();
  const { currentStop, setCurrentStop } = useCurrentStop();
  const [stopsInCurrentTripArr, setStopsInCurrentTripArr] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const convertArrivingTime = (departure) => {

    const dateNow = moment().tz("Europe/Warsaw")

    if (departure.status === "REALTIME") {

      const estimatedTime = moment(departure.estimatedTime)
      const theoreticalTime = moment(departure.theoreticalTime)
      
      const differenceRealNow = estimatedTime - dateNow >= 0 ? Math.floor((estimatedTime - dateNow)/1000/60) : Math.round((estimatedTime - dateNow)/1000/60)
      const differencePlanNow = theoreticalTime - dateNow >= 0 ? Math.floor((theoreticalTime - dateNow)/1000/60) : Math.round((theoreticalTime - dateNow)/1000/60)
      
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

              <p id="departure-stop">{departure.stopName}</p>

              {arriving_status == "bus-late" ? (
                <div className={arriving_status}>
                  Opóźnienie o {differenceRealNow - differencePlanNow} min
                  {differenceRealNow <= 60 ? <>{" • "}<s>{theoreticalTime.format('HH:mm')}</s></> : <></>}
                </div>
              ) : arriving_status == "bus-early" ? (
                <div className={arriving_status}>
                  Wcześniej o {differencePlanNow - differenceRealNow} min
                  {differenceRealNow <= 60 ? <>{" • "}<s>{theoreticalTime.format('HH:mm')}</s></> : <></>}
                </div>
              ) : (
                <div className={arriving_status}>
                  Na czas
                  {differenceRealNow <= 60 ? ` • ${theoreticalTime.format('HH:mm')}` : <></>}
                </div>
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
                    <div style={{fontSize: "25px", marginBottom: "-10px", fontFamily: '"Sono", sans-serif', fontWeight: "500"}}>{differenceRealNow}</div>
                    <div style={{fontSize: "16px", fontFamily: '"Sono", sans-serif', fontWeight: "500"}}>min</div>
                  </span>
                ) : differenceRealNow > -1 ? (
                  <span className={arriving_status}>{"Teraz"}</span>
                ) : (
                  <span className={arriving_status} style={{whiteSpace: "nowrap"}}>
                    <div style={{fontSize: "25px", marginBottom: "-10px", fontFamily: '"Sono", sans-serif', fontWeight: "500"}}>{Math.abs(differenceRealNow)}</div>
                    <div style={{fontSize: "16px", fontFamily: '"Sono", sans-serif', fontWeight: "500"}}>min temu</div>
                  </span>
                )}
              </p>
            </div>
          </td>
        </>
      );
    } else {

      const theoreticalTime = moment(departure.theoreticalTime)

      const differencePlanNow = theoreticalTime - dateNow >= 0 ? Math.floor((theoreticalTime - dateNow)/1000/60) : Math.round((theoreticalTime - dateNow)/1000/60)

      const arriving_status = "bus-scheduled";

      return (
        <>
          <td>
            <div className="bus__direction">
              <p id="departure-stop">{departure.stopName}</p>
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
                    <div style={{fontSize: "25px", marginBottom: "-10px", fontFamily: '"Sono", sans-serif', fontWeight: "500"}}>{differencePlanNow}</div>
                    <div style={{fontSize: "16px", fontFamily: '"Sono", sans-serif', fontWeight: "500"}}>min</div>
                  </span>
                ) : differencePlanNow > -1 ? (
                  <span className={arriving_status}>{"Teraz"}</span>
                ) : (
                  <span className={arriving_status} style={{whiteSpace: "nowrap"}}>
                    <div style={{fontSize: "25px", marginBottom: "-10px", fontFamily: '"Sono", sans-serif', fontWeight: "500"}}>{Math.abs(differencePlanNow)}</div>
                    <div style={{fontSize: "16px", fontFamily: '"Sono", sans-serif', fontWeight: "500"}}>min temu</div>
                  </span>
                )}
              </p>
            </div>
          </td>
        </>
      );
    }

  }

  const displayStopsInTrip = (stopsInTripArr) => {

    if (stopsInTripArr === false) {
      return(
        <p className="loading-err">Błąd podczas odświeania listy odjazdów</p>
      )
    }

    const dateNow = moment().tz("Europe/Warsaw");

    const currentStopSequence = stopsInTripArr.find(
      element => element.stopName === currentStop.stopName
    ).stopSequence

    let stopsInTripArrCut
    if (showAll === false && currentStopSequence >= 2) {
      stopsInTripArrCut = stopsInTripArr.slice(currentStopSequence - 1)
    } else {
      stopsInTripArrCut = stopsInTripArr
    }

    return (
      <div>
        <table id="stops-in-trip-table">
          <tbody>
            {showAll === false && currentStopSequence >= 2 ? (
              <tr
                id="stops-in-trip-table-control-show-all"
                onClick={() => {
                  setShowAll(true)
                }}
              >
                <td className="route-shape">
                  <div className="line">
                    {/* <div className="circle"></div> */}
                  </div>
                </td>
                <td>
                  <img src={arrowLeftIcon} alt="Show all" />
                  Pokaż poprzednie przystanki
                </td>
                <td></td>
              </tr>
            ) : null}
            {stopsInTripArrCut.map((departure) => (
              <tr
                className={departure.stopSequence < currentStopSequence
                  ? "previous"
                  : departure.stopSequence === currentStopSequence
                    ? "selected"
                    : "next"
                }
                key={`stopsInTripTableNr_${stopsInTripArr.indexOf(departure)}`}
                onClick={() => {
                  const stops = JSON.parse(localStorage.getItem("stops"));
                  if (stops !== null) {
                    for (const stop of stops) {
                      if (stop.stopName === departure.stopName) {
                        sessionStorage.setItem("mapFlyToStop", "true");
                        setCurrentTrip(null)
                        setCurrentStop(stop)
                        // document.querySelector("#map-update-button").click();
                        break;
                      }
                    }
                  }
                }}
              >
                <td className="route-shape">
                  <div className="line">
                    <div className="circle"></div>
                  </div>
                </td>
                {convertArrivingTime(departure)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Updating every 15 seconds
  useEffect(() => {
    if (currentTrip === null) {
      return
    }

    function loadStopsInTrip() {
      fetch(PROXY_URL + "/get-stops-in-trip",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentTrip),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setStopsInCurrentTripArr(data)
        })
        .catch(error => setStopsInCurrentTripArr(false))
    }

    console.log("First loading:", currentTrip);

    loadStopsInTrip();
    setTimeout(() => loadStopsInTrip(), 5000)
    const interval = setInterval(() => loadStopsInTrip(), 15000)
    return () => {
      clearInterval(interval);
    }
    
  }, [currentTrip])

  return(
    <div
      className={`stops-in-trip-table__container${
        theme.palette.mode === "light" ? "" : "-theme-dark"
      }`}
    >
      {stopsInCurrentTripArr !== null ? (
        displayStopsInTrip(stopsInCurrentTripArr)
      ) : (
        <>
          <Loading />
          <Loading />
          <Loading />
          <Loading />
          <Loading />
        </>
      )}
    </div>
  )
}

export default StopsInTrip;