import React, { useEffect, useState } from "react";
import { useTheme } from '@mui/material/styles';

import { useToggleDrawer, useBusStop } from "../../pages/Home";
import sortStopsByLocation from "../../hooks/sortStopsByLocation";
import "./SearchBar.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import searchIcon from "../../assets/search.svg";
import xSymbolIcon from "../../assets/x-symbol.svg";
import busIcon from "../../assets/bus.svg";
import busDarkIcon from "../../assets/bus-dark.svg";
import enterIcon from "../../assets/enter.svg";
import enterDarkIcon from "../../assets/enter-dark.svg";
import goofyAhh from "../../data/goofy_ahh.json";
import ohioModeIntro from "../../assets/ohio-mode-intro.gif";

const LOCAL_URL = "http://localhost:8080";
const HEROKU_PROXY_URL = "https://bypass-cors-error-server.herokuapp.com";
const GOOGLE_PROXY_URL = "https://bypass-cors-server.ew.r.appspot.com";
const PROXY_URL = GOOGLE_PROXY_URL;

function SearchBar() {
  const [searchField, setSearchField] = useState("");
  const [searchShow, setSearchShow] = useState(false);
  const { toggleDrawer, setToggleDrawer } = useToggleDrawer();
  const { busStop, setBusStop } = useBusStop();
  // const [closestStopsList, setClosestStopsList] = useState(null);
  const [userLocationTime, setUserLocationTime] = useState(null);
  // const [reportsStatus, setReportsStatus] = useState(false);
  const theme = useTheme();

  const setToggleDrawerFunc = (value, busStop) => {
    // document.getElementById("bus-stop__select__dropdown").style.display = "none";

    // localStorage.setItem("lastOpenedStopId0", busStop.stopId);
    // localStorage.setItem("lastOpenedStopName0", busStop.stopName);

    // console.log(localStorage.getItem("lastOpenedStopId0"));

    setBusStop(busStop);
    setToggleDrawer(value);

    console.log(busStop);
  };

  const isIPhone = () => {
    if (window.navigator.userAgent.indexOf('iPhone') != -1 && window.navigator.standalone == true) {
      // window.alert("true")
      return true
    } else {
      return false
    }
  }

  const convertToEnglishAlfabet = (str) => {
    return str
      .trim()
      .toLowerCase()
      .replaceAll('"', "")
      .replaceAll("'", "")
      .replaceAll("  ", " ")
      .replaceAll(" -", "")
      .replaceAll(".", "")
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

    const closestStops = JSON.parse(sessionStorage.getItem("zkmBusStops"));
    const filteredSearchField = convertToEnglishAlfabet(searchField);
    // console.log(filteredSearchField);
    let searchResultList = filterStopsBySearch(closestStops, filteredSearchField);
    const searchResultListCut = searchResultList.slice(0, 6)

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
                {searchResultListCut.map((stop) => {
                  return (
                    <tr
                      key={stop.stopName + stop.stopId}
                      className="search-result-item"
                      onClick={() => {
                        // console.log("clicked");
                        sessionStorage.setItem("mapFlyToStop", "true");
                        setSearchShow(false);
                        setSearchField("");
                        setToggleDrawerFunc(true, {
                          stopId: stop.stopId,
                          stopName: stop.stopName,
                        });
                      }}
                    >
                      <td>
                        <img src={theme.palette.mode === "light" ? busIcon : busDarkIcon} alt="Stop icon"></img>
                      </td>
                      <td className="search-result-item-stop">
                        <div id="stop-name">{stop.stopName}</div>
                        <div id="stop-zone-id">{stop.zoneId}</div>
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
                {lastOpenedStopsCut.map((stop) => {
                  return (
                    <tr
                      key={stop.stopName + stop.stopId}
                      className="search-result-item"
                      onClick={() => {
                        // console.log("clicked");
                        sessionStorage.setItem("mapFlyToStop", "true");
                        setSearchShow(false);
                        setSearchField("");
                        setToggleDrawerFunc(true, {
                          stopId: stop.stopId,
                          stopName: stop.stopName,
                        });
                      }}
                    >
                      <td>
                        <img src={theme.palette.mode === "light" ? busIcon : busDarkIcon} alt="Stop icon"></img>
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

    let closestStops = JSON.parse(sessionStorage.getItem("zkmBusStops"));

    const userLocation = JSON.parse(localStorage.getItem("userLocation"));
    // console.log("userLocation:");
    // console.log(userLocation);

    if (
      closestStops === null ||
      userLocation === null ||
      userLocation.lng === null ||
      userLocation.lat === null ||
      (userLocation.time === null && userLocationTime === null) ||
      (new Date() - Date.parse(userLocation.time) > 600000)
    ) {
      if (closestStops != null) {
        if ('geolocation' in navigator) {
          console.log("Geolocation is available")
          navigator.geolocation.getCurrentPosition((position) => {
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
      lon: userLocation.lng,
      lat: userLocation.lat,
    });

    sessionStorage.setItem("zkmBusStops", JSON.stringify(closestStops));
    console.log("Displaying closest stops...");
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
                {closestStopsCut.map((stop) => {
                  return (
                    <tr
                      key={stop.stopName + stop.stopId}
                      className="search-result-item"
                      onClick={() => {
                        // console.log("clicked");
                        sessionStorage.setItem("mapFlyToStop", "true");
                        setSearchShow(false);
                        setSearchField("");
                        setToggleDrawerFunc(true, {
                          stopId: stop.stopId,
                          stopName: stop.stopName,
                        });
                      }}
                    >
                      <td>
                        <img src={theme.palette.mode === "light" ? busIcon : busDarkIcon} alt="Stop icon"></img>
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
          }}
        >
          <img src={xSymbolIcon} alt="Clear search button" />
        </button>
      ) : (
        <></>
      )}

      <input
        type="search"
        placeholder="Szukaj"
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
