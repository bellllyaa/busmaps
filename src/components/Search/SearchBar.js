import React, { useEffect, useState } from "react";
import { useTheme } from '@mui/material/styles';

import isIPhone from "../../hooks/isIPhone";

import { useToggleDrawer, useCurrentStop } from "../../pages/Home";
import sortStopsByLocation from "../../hooks/sortStopsByLocation";
import "./SearchBar.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import searchIcon from "../../assets/search.svg";
import xSymbolIcon from "../../assets/x-symbol.svg";
import busIcon from "../../assets/bus.svg";
import busDarkIcon from "../../assets/bus-dark.svg";
import tramIcon from "../../assets/tram.svg";
import tramDarkIcon from "../../assets/tram-dark.svg";
import trainIcon from "../../assets/train.svg";
import trainDarkIcon from "../../assets/train-dark.svg";
import impostorIcon from "../../assets/impostor.svg";
import impostorDarkIcon from "../../assets/impostor-dark.svg";
import enterIcon from "../../assets/enter.svg";
import enterDarkIcon from "../../assets/enter-dark.svg";
import goofyAhh from "../../data/goofy_ahh.json";
import ohioModeIntro from "../../assets/ohio-mode-intro.gif";
import moment from "moment-timezone";

const LOCAL_URL = "http://localhost:8080";
const HEROKU_PROXY_URL = "https://bypass-cors-error-server.herokuapp.com";
const GOOGLE_PROXY_URL = "https://bypass-cors-server.ew.r.appspot.com";
const AZURE_PROXY_URL = "https://busmaps-server.azurewebsites.net";
const PROXY_URL = AZURE_PROXY_URL;

function SearchBar() {
  const theme = useTheme();
  const [searchField, setSearchField] = useState("");
  const [searchShow, setSearchShow] = useState(false);
  const { toggleDrawer, setToggleDrawer } = useToggleDrawer();
  const { currentStop, setCurrentStop } = useCurrentStop();
  const [userLocationTime, setUserLocationTime] = useState(null);
  const [devHistoryStops, setDevHistoryStops] = useState([]);

  const setToggleDrawerFunc = (value, stop) => {
    
    setCurrentStop(stop);
    setToggleDrawer(value);

    console.log(stop);
  };

  const convertToEnglishAlfabet = (str) => {
    return str
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()
      .replaceAll('"', "")
      .replaceAll("'", "")
      // .replaceAll("  ", " ")
      .replaceAll(" -", "")
      .replaceAll(".", "")
      .replaceAll(",", "")
      .replaceAll("ź", "z")
      .replaceAll("ż", "z")
      .replaceAll("ó", "o")
      .replaceAll("ł", "l")
      .replaceAll("ą", "a")
      .replaceAll("ę", "e")
      .replaceAll("ś", "s")
      .replaceAll("ć", "c")
      .replaceAll("ń", "n");
  };

  const filterStopsBySearch = (stopsList, searchField) => {

    let resultList = [];
    for (const stop of stopsList) {
      let isFound = true;
      const convertedStopName = convertToEnglishAlfabet(stop.stopName);
      for (const word of searchField.split(" ")) {
        if (convertedStopName.search(word) === -1) {
          isFound = false;
          break;
        }
      }
      if (isFound) {
        resultList.push(stop);
      }
      // if (convertToEnglishAlfabet(stop.stopName).search(searchField) != -1) {
      //   // console.log(convertToEnglishAlfabet(stop.stopName));
      //   resultList.push(stop);
      // }
    }

    return resultList;
  }

  const SearchResultList = (props) => {

    const closestStops = JSON.parse(localStorage.getItem("stops"));
    const filteredSearchField = convertToEnglishAlfabet(searchField);
    let searchResultList = [];
    if (closestStops !== null) {
      searchResultList = filterStopsBySearch(closestStops, filteredSearchField);
    }
    const searchResultListCut = searchResultList.slice(0, 6)

    // console.log(searchResultListCut)

    // if (searchResultListCut.length <= 5 && searchResultListCut.length >= 1) {
    //   console.log(document.getElementById("search-result-list-table").firstChild.firstChild);
    //   setTimeout(() => {document.getElementById("search-result-list-table").firstChild.firstChild.style.backgroundColor = "rgb(241, 241, 241)"}, 0);
    // }

    return (
      <>
        <div className="search-result-divider"></div>
        <div className="search-result-element">
          <p>Wyniki wyszukiwania:</p>
          <div>
            <table id="search-result-list-table">
              <tbody>
                {searchResultListCut.map(stop => {

                  const vehicle = {
                    icon: null,
                    color: null
                  }
                  if (localStorage.getItem("mode") === "ohio") {
                    vehicle.icon = theme.palette.mode === "light" ? impostorIcon : impostorDarkIcon
                    vehicle.color = "#3b92f2"
                  } else if (stop.stopType === "train") {
                    vehicle.icon = theme.palette.mode === "light" ? trainIcon : trainDarkIcon
                    vehicle.color = "#e9b800"
                  } else if (stop.stopType === "tram" || stop.stopType === "bus, tram") {
                    vehicle.icon = theme.palette.mode === "light" ? tramIcon : tramDarkIcon
                    vehicle.color = "#f20000"
                  } else {
                    vehicle.icon = theme.palette.mode === "light" ? busIcon : busDarkIcon
                    vehicle.color = "#3b92f2"
                  }

                  return (
                    <tr
                      key={stop.stopName}
                      className="search-result-item"
                      onClick={() => {
                        // console.log("clicked");
                        sessionStorage.setItem("mapFlyToStop", "true");
                        setSearchShow(false);
                        setSearchField("");
                        setToggleDrawerFunc(true, stop);
                      }}
                    >
                      <td>
                        <img src={vehicle.icon} alt="Stop icon" style={{backgroundColor: vehicle.color}}></img>
                      </td>
                      <td className="search-result-item-stop">
                        <div id="stop-name">{stop.stopName}</div>
                        {stop.zoneName !== null ? <div id="stop-zone-id">{stop.zoneName}</div> : null}
                      </td>
                      {searchResultListCut.indexOf(stop) === 0 ? (
                        <td>
                          <img id="enter-icon" src={theme.palette.mode === "light" ? enterIcon : enterDarkIcon} alt="Enter icon"></img>
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {localStorage.getItem("mode") === "ohio" ? (
              <img
                style={{
                  width: "100%",
                  height: "calc(100% + 30px)",
                  position: "absolute",
                  left: "0",
                  top: "-20px",
                  zIndex: "1",
                  opacity: theme.palette.mode === "light" ? "0.2" : "0.1",
                  pointerEvents: "none"
                }}
                src={goofyAhh.fullHeight[1]}
                // alt="Goofy ahh image"
              ></img>
            ) : null}
      </>
    )
  }

  const SearchHistoryList = () => {
    const lastOpenedStops = JSON.parse(localStorage.getItem("lastOpenedStops"));

    if (lastOpenedStops === null || lastOpenedStops.length <= 1) {
      return;
    }

    const lastOpenedStopsCut = lastOpenedStops.slice(0, 3);

    return (
      <>
        <div className="search-result-divider"></div>
        <div className="search-result-element">
          <p>Historia wyszukiwania:</p>
          <div>
            <table id="search-result-closest-stops-table">
              <tbody>
                {lastOpenedStopsCut.map(stop => {

                  const vehicle = {
                    icon: null,
                    color: null
                  }
                  if (localStorage.getItem("mode") === "ohio") {
                    vehicle.icon = theme.palette.mode === "light" ? impostorIcon : impostorDarkIcon
                    vehicle.color = "#3b92f2"
                  } else if (stop.stopType === "train") {
                    vehicle.icon = theme.palette.mode === "light" ? trainIcon : trainDarkIcon
                    vehicle.color = "#e9b800"
                  } else if (stop.stopType === "tram" || stop.stopType === "bus, tram") {
                    vehicle.icon = theme.palette.mode === "light" ? tramIcon : tramDarkIcon
                    vehicle.color = "#f20000"
                  } else {
                    vehicle.icon = theme.palette.mode === "light" ? busIcon : busDarkIcon
                    vehicle.color = "#3b92f2"
                  }

                  return (
                    <tr
                      key={stop.stopName + stop.zoneName}
                      className="search-result-item"
                      onClick={() => {
                        sessionStorage.setItem("mapFlyToStop", "true");
                        setSearchShow(false);
                        setSearchField("");
                        setToggleDrawerFunc(true, stop);
                      }}
                    >
                      <td>
                        <img src={vehicle.icon} alt="Stop icon" style={{backgroundColor: vehicle.color}}></img>
                      </td>
                      <td className="search-result-item-stop">
                        <div id="stop-name">{stop.stopName}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }

  const ClosestStopsList = () => {
    // setTimeout(() => {setClosestStopsList(JSON.parse(sessionStorage.getItem("zkmBusStops")))}, 10);

    let closestStops = JSON.parse(localStorage.getItem("stops"));

    const userLocation = JSON.parse(localStorage.getItem("userLocation"));

    if (
      closestStops === null ||
      userLocation === null ||
      userLocation.lng === null ||
      userLocation.lat === null ||
      (userLocation.time === null && userLocationTime === null) ||
      (new Date() - Date.parse(userLocation.time) > 600000)
    ) {
      if (closestStops !== null) {
        if ('geolocation' in navigator) {
          console.log("Geolocation is available")
          navigator.geolocation.getCurrentPosition(position => {
            localStorage.setItem("userLocation", JSON.stringify({lng: position.coords.longitude, lat: position.coords.latitude, time: new Date()}));
            // localStorage.setItem("lastUserLocationLon", position.coords.longitude);
            // localStorage.setItem("lastUserLocationLat", position.coords.latitude);
            // sessionStorage.setItem("userLocation", JSON.stringify({lng: position.coords.longitude, lat: position.coords.latitude, time: new Date()}));
            // console.log(JSON.parse(localStorage.getItem("userLocation")));
            setUserLocationTime(new Date());
          });
        } else {
          console.log("Geolocation is not available");
        }
      }
      return (
        <>
          <div className="search-result-divider"></div>
          <div className="search-result-element" style={{height: "43px", width: "100vw", display: "inline-flex"}}>
            <p style={{width: "auto"}}>Najbliższe przystanki:</p>
            <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          </div>
          {localStorage.getItem("mode") === "ohio" ? (
              <img
                style={{
                  width: "100%",
                  height: "calc(100% + 30px)",
                  position: "absolute",
                  left: "0",
                  top: "-20px",
                  zIndex: "1",
                  opacity: theme.palette.mode === "light" ? "0.2" : "0.1",
                  pointerEvents: "none"
                }}
                src={goofyAhh.fullHeight[1]}
                // alt="Goofy ahh image"
              ></img>
            ) : null}
        </>
      )
    }

    // console.log(new Date() - Date.parse(userLocation.time));

    closestStops = sortStopsByLocation(closestStops, {
      lng: userLocation.lng,
      lat: userLocation.lat,
    });

    localStorage.setItem("stops", JSON.stringify(closestStops));
    // console.log("Displaying closest stops...");
    // console.log(userLocation);
    // console.log(closestStops);

    const closestStopsCut = closestStops.slice(0, 5);

    // if ('geolocation' in navigator) {
    //   console.log("Geolocation is available")
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     console.log(Math.abs(localStorage.getItem("lastUserLocationLon") - position.coords.longitude));
    //     console.log(Math.abs(localStorage.getItem("lastUserLocationLat") - position.coords.latitude));

    //     if (Math.abs(localStorage.getItem("lastUserLocationLon") - position.coords.longitude) > 0.01  || Math.abs(localStorage.getItem("lastUserLocationLat") - position.coords.latitude) > 0.01) {
    //       console.log(position.coords.latitude, position.coords.longitude);
    //       localStorage.setItem("lastUserLocationLon", position.coords.longitude);
    //       localStorage.setItem("lastUserLocationLat", position.coords.latitude);
    //       setClosestStopsList(sortStopsByLocation(closestStopsList, {lon: position.coords.longitude, lat: position.coords.latitude}));
    //     }
    //   });
    // } else {
    //   console.log("Geolocation is not available");
    // }

    return (
      <>
        <div className="search-result-divider"></div>
        <div className="search-result-element">
          <p>Najbliższe przystanki:</p>
          <div>
            <table id="search-result-closest-stops-table">
              <tbody>
                {closestStopsCut.map(stop => {

                  const vehicle = {
                    icon: null,
                    color: null
                  }
                  if (localStorage.getItem("mode") === "ohio") {
                    vehicle.icon = theme.palette.mode === "light" ? impostorIcon : impostorDarkIcon
                    vehicle.color = "#3b92f2"
                  } else if (stop.stopType === "train") {
                    vehicle.icon = theme.palette.mode === "light" ? trainIcon : trainDarkIcon
                    vehicle.color = "#e9b800"
                  } else if (stop.stopType === "tram" || stop.stopType === "bus, tram") {
                    vehicle.icon = theme.palette.mode === "light" ? tramIcon : tramDarkIcon
                    vehicle.color = "#f20000"
                  } else {
                    vehicle.icon = theme.palette.mode === "light" ? busIcon : busDarkIcon
                    vehicle.color = "#3b92f2"
                  }

                  return (
                    <tr
                      key={stop.stopName + stop.zoneName}
                      className="search-result-item"
                      onClick={() => {
                        // console.log("clicked");
                        sessionStorage.setItem("mapFlyToStop", "true");
                        setSearchShow(false);
                        setSearchField("");
                        setToggleDrawerFunc(true, stop);
                      }}
                    >
                      <td>
                        <img src={vehicle.icon} alt="Stop icon" style={{backgroundColor: vehicle.color}}></img>
                      </td>
                      <td className="search-result-item-stop">
                        <div id="stop-name">{stop.stopName}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {localStorage.getItem("mode") === "ohio" ? (
              <img
                style={{
                  width: "100%",
                  height: "calc(100% + 30px)",
                  position: "absolute",
                  left: "0",
                  top: "-20px",
                  zIndex: "1",
                  opacity: theme.palette.mode === "light" ? "0.2" : "0.1",
                  pointerEvents: "none"
                }}
                src={goofyAhh.fullHeight[1]}
                // alt="Goofy ahh image"
              ></img>
            ) : null}
      </>
    );
  };

  const handleChange = (e) => {
    // console.log(e.target.value.toLowerCase());
    setSearchField(e.target.value.toLowerCase());
  };

  const SearchResult = () => {
    const searchBarContainerElement = document.getElementsByClassName(
      "search-bar__container"
    )[0];

    if (searchShow) {

      searchBarContainerElement.style.transition =
        "height 0s ease 0s, background-color 0.4s ease";
      searchBarContainerElement.style.height = "100vh";
      searchBarContainerElement.style.background = theme.palette.mode === "light"
        ? "#ffffff"
        : "#232527";
      searchBarContainerElement.style.zIndex = "10000";

      if (searchField.split("").filter((char) => char === " ").length !== searchField.length) {

        // Search bar commands
        if (searchField === "/mode default") {
          localStorage.removeItem("mode");
          setTimeout(() => {
            window.alert("You entered default mode!");
            setSearchField("");
            try {
              document.querySelector("#map-update-button").click();
            } catch {}
          }, 100);
          return <h1>Bruh</h1>;
        } else if (searchField === "/mode ohio") {
          localStorage.setItem("mode", "ohio");
          // setTimeout(() => { window.alert("u entered ohio mode") }, 500);
          document.querySelector(".search-bar__container").querySelector("[type=search]").blur();
          return (
            <img
              style={{
                width: "100%",
                height: "100vh",
                position: "fixed",
                left: "0",
                top: "0",
                zIndex: "1",
              }}
              onLoad={() => {
                setTimeout(() => {
                  setSearchField("");
                  try {
                    document.querySelector("#map-update-button").click();
                  } catch {}
                }, 10500);
              }}
              src={ohioModeIntro}
              // alt="Goofy ahh image"
            ></img>
          );
        } else if (searchField === "/dev history stops") {
          document.querySelector(".search-bar__container").querySelector("[type=search]").blur();
          if (devHistoryStops.length === 0) {
            fetch(PROXY_URL + "/dev/history/stops")
              .then(result => result.json())
              .then(data => {
                console.log("Fetched successfully");
                setDevHistoryStops(data);
              })
          }
          return(
            <div style={{
              height: "calc(100vh - 150px)",
              overflowY: "scroll"
            }}
            >
              <table style={{
                borderCollapse: "collapse",
                width: "100%"
              }}>
                <tbody>
                  <tr style={{borderBottom: "1px solid #ddd", height: "40px"}}>
                    <th>Stop name</th>
                    <th>First request date</th>
                    <th>Count</th>
                  </tr>
                  {devHistoryStops.map(element => (
                    <tr
                      style={{borderBottom: "1px solid #ddd", height: "40px"}}
                      key={`devHistoryStopsNr${devHistoryStops.indexOf(element)}`}
                      onClick={() => {
                        const stops = JSON.parse(localStorage.getItem("stops"));
                        if (stops !== null) {
                          for (const stop of stops) {
                            if (stop.stopName === element.stopName) {
                              sessionStorage.setItem("mapFlyToStop", "true");
                              setSearchShow(false);
                              setSearchField("");
                              setDevHistoryStops([]);
                              setToggleDrawerFunc(true, stop);
                              break;
                            }
                          }
                        }
                      }}
                    >
                      <td>{element.stopName}</td>
                      <td>{moment(element.requestDate).format("YYYY-MM-DD HH:mm:ss")}</td>
                      <td>{element.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        } /*else if (searchField === "/reports") {
          if (!(reportsStatus && reportsStatus.status)) {
            // console.log(reportsStatus);
            fetch(PROXY_URL + "/reports")
              .then(result => result.json())
              .then(data => {
                console.log("Fetched successfully");
                // console.log(data);
                if (data[0]) {
                  // console.log(data[0]);
                  // console.log(data[0].reportsAvailable);
                  data[0].status = "ready";
                  // console.log(data[0]);
                  setReportsStatus(data[0]);
                }
              })
              .catch((error) => {
                console.log("Failed to fetch");
                setReportsStatus({status: "failed", reportsAvailable: "failed to fetch"});
              })
          } else {
            console.log("Not fetching...");
          }
          return (
            <div>
              {reportsStatus && reportsStatus.status ? <h3 style={{marginLeft: "10px"}}>Available reports: {reportsStatus.reportsAvailable}</h3> : <h3 style={{marginLeft: "10px"}}>Checking reports...</h3>}
            </div>
          )
        } else if (searchField === "/clear-reports") {
          if (!(reportsStatus && reportsStatus.status)) {
            // console.log(reportsStatus);
            fetch(PROXY_URL + "/reports/clear-all")
              .then(result => result.json())
              .then(data => {
                console.log("Fetched successfully");
                // console.log(data);
                if (data[0]) {
                  // console.log(data[0]);
                  data[0].status = "ready";
                  // console.log(data[0]);
                  setReportsStatus(data[0]);
                }
              })
              .catch((error) => {
                console.log("Failed to fetch");
                setReportsStatus({status: "failed", answer: "Failed to fetch"});
              })
          } else {
            console.log("Not fetching...");
          }
          return (
            <div>
              {reportsStatus && reportsStatus.status ? <h3 style={{marginLeft: "10px"}}>{reportsStatus.answer}</h3> : <h3 style={{marginLeft: "10px"}}>Clearing reports...</h3>}
            </div>
          )
        }

        if (reportsStatus) {
          // console.log(reportsStatus);
          setTimeout(() => {setReportsStatus(false)}, 10);
        }*/

        return (
          <div className={`search-result__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`}>
            <SearchResultList />
          </div>
        );

      } else {
        if (searchField != "") {
          setTimeout(() => { setSearchField("") }, 1);
        }

        return (
          <div className={`search-result__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`}>
            <SearchHistoryList />
            <ClosestStopsList />
          </div>
        );
      }
    } else {
      // try {
      //   if (theme.palette.mode === "light") {
      //     document.querySelectorAll('meta[name="theme-color"]')[0].setAttribute('content', "#ece7e4");
      //   } else {
      //     document.querySelectorAll('meta[name="theme-color"]')[1].setAttribute('content', "#343332");
      //   }
      // } catch {}
      try {
        searchBarContainerElement.style.transition =
          "height 0s ease 0.4s, background-color 0.4s ease";
        searchBarContainerElement.style.height = "70px";
        searchBarContainerElement.style.background = "none";
        searchBarContainerElement.style.zIndex = "1";
      } catch {}
    }
  };

  useEffect(() => {
    if (searchShow === true) {
      if (sessionStorage.getItem("downloadBannerVisibility") === "false") {
        try {
          if (theme.palette.mode === "light") {
            document.querySelectorAll('meta[name="theme-color"]')[0].setAttribute('content', "#ffffff");
          } else {
            document.querySelectorAll('meta[name="theme-color"]')[1].setAttribute('content', "#232527");
            document.querySelector(".search-bar__container").querySelector(".search-bar__container-input-theme-dark").style.boxShadow = "";
          }
        } catch {}
      }
    } else {
      if (sessionStorage.getItem("downloadBannerVisibility") === "false") {
        try {
          if (theme.palette.mode === "light") {
            document.querySelectorAll('meta[name="theme-color"]')[0].setAttribute('content', "#ece7e4");
          } else {
            document.querySelectorAll('meta[name="theme-color"]')[1].setAttribute('content', "#343332");
            document.querySelector(".search-bar__container").querySelector(".search-bar__container-input-theme-dark").style.boxShadow = "none";
          }
        } catch {}
      }
    }
  }, [searchShow])

  return (
    <div className="search-bar__container">
      <button
        className={`${theme.palette.mode === "light" ? "" : "search-bar__container-button-theme-dark"}`}
        style={{top: isIPhone() ? "11px" : "21px"}}
        onClick={() => {
          setSearchShow(!searchShow);
        }}
      >
        <img
          src={searchShow ? arrowLeftIcon : searchIcon}
          alt="Search bar button"
        />
      </button>
      {searchField != "" ? (
        <button
          className={`clear-search-button${theme.palette.mode === "light" ? "" : " search-bar__container-button-theme-dark"}`}
          style={{top: isIPhone() ? "11px" : "21px"}}
          onClick={() => {
            setSearchField("");
            if (devHistoryStops.length !== 0) {
              setDevHistoryStops([])
            }
          }}
        >
          <img src={xSymbolIcon} alt="Clear search button" />
        </button>
      ) : (
        <></>
      )}

      <input
        type="search"
        placeholder={localStorage.getItem("mode") === "ohio" ? "find sniggers nearby" : "Szukaj"}
        value={searchField}
        className={theme.palette.mode === "light" ? "" : "search-bar__container-input-theme-dark"}
        style={theme.palette.mode === "light"
          ? {backgroundColor: "#ffffff", color: "black", marginTop: isIPhone() ? "10px" : "20px"}
          : {backgroundColor: "#232527", color: "white", marginTop: isIPhone() ? "10px" : "20px"}}
        onChange={handleChange}
        onSelect={() => {
          setSearchShow(true);
        }}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            if (document.getElementById("search-result-list-table") != null) {
              try {
                document.querySelector(".search-bar__container").querySelector("[type=search]").blur();
              } catch {}
              document.getElementById("search-result-list-table").firstChild.firstChild.click();
            }
          }
        }}
      ></input>

      <SearchResult />
    </div>
  );
}

export default SearchBar;
