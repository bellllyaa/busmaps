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

import { useToggleDrawer, useBusStop } from "../../pages/Home";
import useWindowDimensions from "../../hooks/useWindowDimensions";
// import DeparturesTable from "../BusStop/DeparturesTable";
import CallDeparturesTable from "./CallDeparturesTable";
import Options from "./Options";
// import Select from "react-select";
import "./SwipeableEdgeDrawer.css";
// import zkmBusStops from "../Map/data/zkm-bus-stops.json";

// Icons
import XSymbolIcon from "../../assets/x-symbol.svg";
import threeDotsIcon from "../../assets/three-dots.svg";

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
  const { busStop, setBusStop } = useBusStop();
  const windowDimensions = useWindowDimensions();
  console.log(windowDimensions);
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
    if (value === true) {
      // document.getElementById("bus-stop__select__dropdown").style.display = "none";
      // document.getElementById("bus-stop__select__dropdown").style.pointerEvents = "none";
      // document.getElementById("swipable-edge-drawer__close-button").style.display = "block";
      // document.getElementById("bus-stop__select__dropdown").style.opacity = 0.5;
    } else {
      // document.getElementById("bus-stop__select__dropdown").style.display = "block";
      // document.getElementById("bus-stop__select__dropdown").style.pointerEvents = "auto";
      // document.getElementById("swipable-edge-drawer__close-button").style.display = "none";
      // document.getElementById("bus-stop__select__dropdown").style.opacity = 1;
    }

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

  React.useEffect(() => {
    if (toggleDrawer === false) {
      // setOptionsVisibility(false);
      try {
        if (theme.palette.mode === "light") {
          document.querySelectorAll('meta[name="theme-color"]')[0].setAttribute('content', "#ece7e4");
        } else {
          document.querySelectorAll('meta[name="theme-color"]')[1].setAttribute('content', "#343332");
        }
      } catch {}

      try {
        document.getElementsByClassName("buttons__container")[0].style.display = "none";
      } catch {}
    } else if (toggleDrawer === true) {
      try {
        if (theme.palette.mode === "light") {
          document.querySelectorAll('meta[name="theme-color"]')[0].setAttribute('content', "#757371");
        } else {
          document.querySelectorAll('meta[name="theme-color"]')[1].setAttribute('content', "#1a1919");
        }
      } catch {}

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
      const textHeight = stopName.current.clientHeight;
      // console.log(textHeight);
      // console.log(stopName.current.innerText);

      if (textHeight >= 200) {
        setStopNameHeight(-239.5);
      } else if (textHeight >= 164) {
        setStopNameHeight(-203.5);
      } else if (textHeight >= 128) {
        setStopNameHeight(-167.5);
      } else if (textHeight >= 92) {
        setStopNameHeight(-131.5);
      } else {
        setStopNameHeight(-95.5);
      }
    }
    
  }, [stopName])

  return (
    <div className="swipable-edge-drawer">
      {optionsVisibility && <Options />}
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
          swipeAreaWidth={150}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
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
              top: stopNameHeight
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
            {busStop ? (
              <div className={`upper-part__container${theme.palette.mode === "light" ? "" : "-theme-dark"}`}>
                <h2 ref={stopName}>{busStop.stopName}</h2>
                <div className="buttons__container">
                  <button id="show-options-button" onClick={() => {
                    document.querySelector("#show-options-button").style.backgroundColor = theme.palette.mode === "light" ? "#bbbbbb" : "#1c1c1f";
                    setTimeout(() => {
                      document.querySelector("#show-options-button").style.backgroundColor = theme.palette.mode === "light" ? "#e9e9e9" : "#37383d";
                    }, 70);
                    // e.target.style.backgroundColor = "black";
                    setOptionsVisibility(!optionsVisibility)
                  }}>
                    <img src={threeDotsIcon} alt="Options button" style={{width: "15px", marginTop: "3px"}} />
                  </button>
                  <button id="close-button" onClick={setToggleDrawerFunc(false)}>
                    <img src={XSymbolIcon} alt="Close button" style={{width: "12px", marginTop: "3px"}} />
                  </button>
                </div>
              </div>
            ) : (
              <h2 style={{color: theme.palette.mode === "light" ? "black" : "white"}}>Wybierz przystanek</h2>
            )}
          </StyledBox>
          <StyledBox
            sx={{
              px: 0,
              pb: 0,
              height: "100%",
              overflow: "auto",
              // marginTop: toggleDrawer === true && isIPhone() ? "-20px" : 0,
            }}
          >
            {/* <p style={{marginTop: "20px"}}></p> */}
            {/* {optionsVisibility && <Options />} */}
            {busStop != null ? (
              <CallDeparturesTable
                key={busStop.stopId}
                busStopId={busStop.stopId}
                busStopName={busStop.stopName}
              />
            ) : (
              <></>
            )}
            {/* <div className="bus-stop__select__dropdown">
              <Select
                options={createRoutesDropdown()}
                onChange={onChangeStop}
                placeholder="Bus stop"
              />
            </div> */}
            {/* <BusStop /> */}
            {/* {windowDimensions.width}x{windowDimensions.height} */}
            {/* <Box sx={{ textAlign: 'center', pt: 1 }}>
              <Button onClick={setToggleDrawerFunc(false)}>Close</Button>
            </Box> */}
          </StyledBox>
        </SwipeableDrawer>
      </Root>
    </div>
  );
}

export default SwipeableEdgeDrawer;
