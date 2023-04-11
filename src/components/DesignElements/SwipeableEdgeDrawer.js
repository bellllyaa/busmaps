import * as React from "react";
// import { Link } from "react-router-dom";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
// import Button from "@mui/material/Button";
// import PropTypes from "prop-types";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import { useTheme } from '@mui/material/styles';
// import Skeleton from '@mui/material/Skeleton';
// import Typography from '@mui/material/Typography';

import { useToggleDrawer, useCurrentStop, useCurrentTrip } from "../../pages/Home";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import DeparturesTable from "../BusStop/DeparturesTable";
import Options from "./Options";
import "./SwipeableEdgeDrawer.css";

// Icons
import XSymbolIcon from "../../assets/x-symbol.svg";
import threeDotsIcon from "../../assets/three-dots.svg";
import ztmGdanskLogo from "../../assets/stop-providers/ztm-gdansk-logo.png";
import zkmGdyniaLogo from "../../assets/stop-providers/zkm-gdynia-logo.png";
import mzkWejherowoLogo from "../../assets/stop-providers/mzk-wejherowo-logo.png";
import polRegioLogo from "../../assets/stop-providers/polregio-logo.svg";
import pkpIntercityLogo from "../../assets/stop-providers/pkp-intercity-logo.jpg";
import skmTrojmiastoLogo from "../../assets/stop-providers/skm-trojmiasto-logo.png";
import StopsInTrip from "../StopsInTrip/StopsInTrip";

// const createRoutesDropdown = () => {
//   if (zkmBusStops) {
//     //console.log(busStopsList)
//     return (
//       zkmBusStops
//         .sort((a, b) => a.stopName > b.stopName ? 1 : -1)
//         .map((s) => (
//           {value: s.stopId, label: s.stopName}
//         ))
//     )
//   }
// }

// function Loading () {
//   return (
//     <Skeleton variant="rectangular" height="100%" />
//   )
// }

const adjustMapSize = (size) => {
  // try {
  //   document.getElementsByClassName("map-container")[0].style.height = `calc(100vh - ${size}px)`;
  // } catch {
  //   console.log("Err")
  // }
  return 0;
}

const isIPhone = () => {
  // console.log("is")

  let response;
  try {
    // console.log(window.navigator.userAgent.slice(13, 19) === "iPhone");
    response = window.navigator.userAgent.slice(13, 19) === "iPhone";
  } catch {
    // console.log(window);
    response = false;
  }
  return response;
};

const drawerBleeding = 76;

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor:
    theme.palette.mode === "light"
      ? grey[100]
      : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#232527",
  // marginTop: "-20px",
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 40,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[700],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 20px)",
}));

function SwipeableEdgeDrawer(props) {
  // Variables
  const theme = useTheme();
  const { toggleDrawer, setToggleDrawer } = useToggleDrawer();
  const { currentStop, setCurrentStop } = useCurrentStop();
  const { currentTrip, setCurrentTrip } = useCurrentTrip();
  const windowDimensions = useWindowDimensions();
  // console.log(windowDimensions);
  const [optionsVisibility, setOptionsVisibility] = React.useState(false);
  const stopName = React.createRef();
  const [stopNameHeight, setStopNameHeight] = React.useState(-95.5);

  const swipableEdgeDrawerStyleHorizontal = () => {
    return {
      ".MuiDrawer-root > .MuiPaper-root": {
        height: `calc(80% - ${drawerBleeding}px)`,
        left: windowDimensions.width / 2 - 300,
        right: windowDimensions.width / 2 - 300,
        overflow: "visible",
      },
    };
  };

  const swipableEdgeDrawerStyleVertical = () => {
    return {
      ".MuiDrawer-root > .MuiPaper-root": {
        height: `calc(80% - ${drawerBleeding}px)`,
        left: 0,
        right: 0,
        overflow: "visible",
      },
    };
  };

  const { window } = props;

  const setToggleDrawerFunc = (value) => () => {
    setToggleDrawer(value);
  };

  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined;

  React.useEffect(() => {
    // $('#bus-stop__select__dropdown').animate({...}, function () {
    //   $('#bus-stop__select__dropdown').css({marginTop: '-=15px'});
    // });
    // document.getElementById('#bus-stop__select__dropdown').animate({marginTop: '-=15px'});
  }, []);

  // React.useEffect(() => {
  //   console.log(currentStop)
  // }, [currentStop])

  React.useEffect(() => {
    if (toggleDrawer === false) {
      try {
        document.querySelector(`.upper-part__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`).querySelector("h2").style.marginRight = "15px";
      } catch {}
      if (sessionStorage.getItem("downloadBannerVisibility") !== "false") {
        try {
          if (theme.palette.mode === "light") {
            document.querySelectorAll('meta[name="theme-color"]')[0].setAttribute('content', "#f2f2f2");
          } else {
            document.querySelectorAll('meta[name="theme-color"]')[1].setAttribute('content', "#1c1c1e");
          }
        } catch {}
      } else {
        try {
          if (theme.palette.mode === "light") {
            document.querySelectorAll('meta[name="theme-color"]')[0].setAttribute('content', "#ece7e4");
          } else {
            document.querySelectorAll('meta[name="theme-color"]')[1].setAttribute('content', "#343332");
          }
        } catch {}
      }

      try {
        document.getElementsByClassName("buttons__container")[0].style.display = "none";
      } catch {}
    } else if (toggleDrawer === true) {
      try {
        document.querySelector(`.upper-part__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`).querySelector("h2").style.marginRight = "100px";
      } catch {}
      if (sessionStorage.getItem("downloadBannerVisibility") !== "false") {
        try {
          if (theme.palette.mode === "light") {
            document.querySelectorAll('meta[name="theme-color"]')[0].setAttribute('content', "#787878");
          } else {
            document.querySelectorAll('meta[name="theme-color"]')[1].setAttribute('content', "#0e0e0f");
          }
        } catch {}
      } else {
        try {
          if (theme.palette.mode === "light") {
            document.querySelectorAll('meta[name="theme-color"]')[0].setAttribute('content', "#757371");
          } else {
            document.querySelectorAll('meta[name="theme-color"]')[1].setAttribute('content', "#1a1919");
          }
        } catch {}
      }

      try {
        document.getElementsByClassName("buttons__container")[0].style.display = "block";
      } catch {}
    }
    // console.log(document.getElementsByClassName("buttons__container")[0])
  }, [toggleDrawer])

  React.useEffect(() => {
    if (optionsVisibility) {
      document.querySelector(`.options__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`).style.display = "block";
    } else {
      try {
        document.querySelector(`.options__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`).style.display = "none";
      } catch {}
    }
  }, [optionsVisibility])

  React.useEffect(() => {

    if (stopName.current) {
      // console.log(stopName);
      const textHeight = stopName.current.clientHeight;
      // console.log(textHeight);
      // console.log(stopName.current.innerText);

      console.log(textHeight)
      if (textHeight >= 200) {
        try {
          document.querySelector(`.mapboxgl-ctrl-geolocate-custom-buttons__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`).style.top = "calc(100% - 339px)";
        } catch {}
        setStopNameHeight(-239.5);
      } else if (textHeight >= 164) {
        try {
          document.querySelector(`.mapboxgl-ctrl-geolocate-custom-buttons__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`).style.top = "calc(100% - 303px)";
        } catch {}
        setStopNameHeight(-203.5);
      } else if (textHeight >= 128) {
        try {
          document.querySelector(`.mapboxgl-ctrl-geolocate-custom-buttons__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`).style.top = "calc(100% - 268px)";
        } catch {}
        setStopNameHeight(-167.5);
      } else if (textHeight >= 92) {
        try {
          document.querySelector(`.mapboxgl-ctrl-geolocate-custom-buttons__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`).style.top = "calc(100% - 231px)";
        } catch {}
        setStopNameHeight(-131.5);
      } else {
        try {
          document.querySelector(`.mapboxgl-ctrl-geolocate-custom-buttons__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`).style.top = "calc(100% - 196px)";
        } catch {}
        setStopNameHeight(-95.5);
      }
    }
    
  }, [stopName, toggleDrawer])

  return (
    <div className="swipable-edge-drawer">
      <Options />
      <Root>
        <div className="safe-area"></div>
        <CssBaseline />
        <Global
          styles={
            windowDimensions.height > windowDimensions.width &&
            windowDimensions.width <= 600
              ? swipableEdgeDrawerStyleVertical()
              : swipableEdgeDrawerStyleHorizontal()
          }
        />
        {/* <Box sx={{ textAlign: 'center', pt: 1 }}>
          <Button onClick={setToggleDrawerFunc(true)}>Open</Button>
        </Box> */}
        <SwipeableDrawer
          container={container}
          anchor="bottom"
          open={toggleDrawer}
          onClose={setToggleDrawerFunc(false)}
          onOpen={setToggleDrawerFunc(true)}
          swipeAreaWidth={-stopNameHeight + 10}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
            // keepMounted: currentStop !== null ? true : false,
          }}
        >
          <StyledBox
            sx={{
              position: "absolute",
              // top: -drawerBleeding,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              visibility: "visible",
              right: 0,
              left: 0,
              top: stopNameHeight,
            }}
          >
            <Puller />
            {/* <Typography sx={{ p: 2, color: 'text.secondary' }}>Bus stop</Typography> */}
            {/* <div id="bus-stop__select__dropdown">
              <Select
                options={{}}
                onChange={console.log}
                placeholder="Bus stop"
              />
            </div> */}
            {currentTrip && currentTrip !== null ? (
              <div
                className={`upper-part__container${
                  theme.palette.mode === "light" ? "" : "-theme-dark"
                }`}
              >
                <span className="route-name">
                  <p
                    className={currentTrip.status}
                    style={
                      currentTrip.color
                        ? currentTrip.color
                        : {}
                    }
                  >
                    {currentTrip.routeName}
                  </p>
                  <p id="headsign" ref={stopName}>{currentTrip.headsign}</p>
                </span>

                <div
                  id="bus-info"
                >
                  <div className="buttons__container">
                    <button
                      id="close-button"
                      onClick={() => setCurrentTrip(null)}
                    >
                      <img
                        src={XSymbolIcon}
                        alt="Close button"
                        style={{ width: "12px", marginTop: "3px" }}
                      />
                    </button>
                  </div>

                  {toggleDrawer && false ? (
                    <div className="provider">
                      {currentTrip &&
                      currentTrip.provider === "ZTM Gdańsk" ? (
                        <img
                          src={ztmGdanskLogo}
                          alt=""
                          style={{ backgroundColor: "#ffffff" }}
                        />
                      ) : currentTrip && currentTrip.provider === "ZKM Gdynia"
                      ? (
                        <img
                          src={zkmGdyniaLogo}
                          alt=""
                          style={{ backgroundColor: "#3b84df" }}
                        />
                      ) : null}
                    </div>
                  ) : null}
                </div>

              </div>
            ) : currentStop && currentStop !== null && currentTrip === null ? (
              <div
                className={`upper-part__container${
                  theme.palette.mode === "light" ? "" : "-theme-dark"
                }`}
              >
                <h2 ref={stopName}>{currentStop.stopName}</h2>

                {toggleDrawer ? (
                  <div
                    id="stop-info"
                    onClick={() => {
                      try {
                        const el = document.querySelector(
                          theme.palette.mode === "light"
                            ? ".css-1wr8kee"
                            : ".css-1wk78lo"
                        );
                        const maxElScrollTop =
                          el.scrollHeight - el.clientHeight - 0.5;
                        el.scroll(0, maxElScrollTop);
                      } catch {}
                    }}
                  >
                    {currentStop &&
                    currentStop.providers.find(
                      (provider) => provider.stopProvider === "ZTM Gdańsk"
                    ) !== undefined ? (
                      <img
                        src={ztmGdanskLogo}
                        alt=""
                        style={{ backgroundColor: "#ffffff" }}
                      />
                    ) : null}
                    {currentStop &&
                    currentStop.providers.find(
                      (provider) => provider.stopProvider === "ZKM Gdynia"
                    ) !== undefined ? (
                      <img
                        src={zkmGdyniaLogo}
                        alt=""
                        style={{ backgroundColor: "#3b84df" }}
                      />
                    ) : null}
                    {currentStop &&
                    currentStop.providers.find(
                      (provider) => provider.stopProvider === "MZK Wejherowo"
                    ) !== undefined ? (
                      <img
                        src={mzkWejherowoLogo}
                        alt=""
                        style={{ backgroundColor: "#ffffff", padding: "1px" }}
                      />
                    ) : null}
                    {currentStop &&
                    currentStop.providers.find(
                      (provider) => provider.stopProvider === "SKM Trójmiasto"
                    ) !== undefined ? (
                      <img
                        src={skmTrojmiastoLogo}
                        alt=""
                        style={{ backgroundColor: "#ffffff" }}
                      />
                    ) : null}
                    {currentStop &&
                    currentStop.providers.find(
                      (provider) => provider.stopProvider === "PolRegio"
                    ) !== undefined ? (
                      <img
                        src={polRegioLogo}
                        alt=""
                        style={{ backgroundColor: "#ffffff" }}
                      />
                    ) : null}
                    {currentStop &&
                    currentStop.providers.find(
                      (provider) => provider.stopProvider === "PKP Intercity"
                    ) !== undefined ? (
                      <img
                        src={pkpIntercityLogo}
                        alt=""
                        style={{ backgroundColor: "#ffffff" }}
                      />
                    ) : null}
                    
                    <p>
                      {currentStop.stopType === "train"
                        ? "Stacja kolejowa"
                        : currentStop.stopType === "bus, tram"
                          ? "Przystanek autobusowy i tramwajowy"
                          : currentStop.stopType === "tram"
                            ? "Przystanek tramwajowy"
                            : currentStop.stopType === "bus"
                              ? "Przystanek autobusowy"
                              : "Przystanek"}
                    </p>
                  </div>
                ) : null}
                <div className="buttons__container">
                  <button
                    id="show-options-button"
                    onClick={() => {
                      setOptionsVisibility(!optionsVisibility);
                    }}
                    style={currentTrip ? {visibility: "hidden"} : {}}
                  >
                    <img
                      src={threeDotsIcon}
                      alt="Options button"
                      style={{ width: "15px", marginTop: "3px" }}
                    />
                  </button>
                  <button
                    id="close-button"
                    // onClick={setToggleDrawerFunc(false)}
                    onClick={() => {
                      if (currentTrip) {
                        setCurrentTrip(null)
                      } else {
                        setToggleDrawer(false)
                      }
                      // setCurrentStop(null)
                    }}
                    // onClick={setCurrentStop(null)}
                  >
                    <img
                      src={XSymbolIcon}
                      alt="Close button"
                      style={{ width: "12px", marginTop: "3px" }}
                    />
                  </button>
                </div>
              </div>
            ) : (
              <h2
                style={{
                  color: theme.palette.mode === "light" ? "black" : "white",
                }}
                ref={stopName}
              >
                Wybierz przystanek
              </h2>
            )}

          </StyledBox>
          <StyledBox
            sx={{
              px: 0,
              pb: 0,
              height: "100%",
              overflow: "auto",
            }}
          >
            
            {currentTrip ? (
              <StopsInTrip />
            ) : (
              <DeparturesTable key={currentStop !== null ? currentStop.stopName : "no-stop"} />
            )}
            
          </StyledBox>
        </SwipeableDrawer>
      </Root>
    </div>
  );
}

export default SwipeableEdgeDrawer;
