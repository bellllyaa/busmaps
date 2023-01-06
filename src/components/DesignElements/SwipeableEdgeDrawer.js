import * as React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button'
import PropTypes from 'prop-types';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
// import Skeleton from '@mui/material/Skeleton';
// import Typography from '@mui/material/Typography';

import { useToggleDrawer, useBusStop } from "../../pages/Home";
import { useWindowDimensions } from '../../App';
// import DeparturesTable from "../BusStop/DeparturesTable";
import CallDeparturesTable from './CallDeparturesTable';
// import Select from "react-select";
import "./SwipeableEdgeDrawer.css";
// import zkmBusStops from "../Map/data/zkm-bus-stops.json";

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

const drawerBleeding = 56;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor:
    theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 40,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 20px)',
}));

function SwipeableEdgeDrawer(props) {
  // Variables
  const {toggleDrawer, setToggleDrawer} = useToggleDrawer();
  const {busStop, setBusStop} = useBusStop();
  const windowDimensions = useWindowDimensions();
  console.log(windowDimensions);

  const swipableEdgeDrawerStyleHorizontal = () => {
    return ({
      '.MuiDrawer-root > .MuiPaper-root': {
        height: `calc(80% - ${drawerBleeding}px)`,
        left: windowDimensions.width/2-300,
        right: windowDimensions.width/2-300,
        overflow: 'visible',
      },
    })
  }

  const swipableEdgeDrawerStyleVertical = () => {
    return ({
      '.MuiDrawer-root > .MuiPaper-root': {
        height: `calc(80% - ${drawerBleeding}px)`,
        left: 0,
        right: 0,
        overflow: 'visible',
      },
    })
  }

  const { window } = props;

  const setToggleDrawerFunc = (value) => () => {
    if (value === true) {
      // document.getElementById("bus-stop__select__dropdown").style.pointerEvents = "none";
      document.getElementById("bus-stop__select__dropdown").style.display = "none";
      // document.getElementById("bus-stop__select__dropdown").style.opacity = 0.5;
    } else {
      // document.getElementById("bus-stop__select__dropdown").style.pointerEvents = "auto";
      document.getElementById("bus-stop__select__dropdown").style.display = "block";
      // document.getElementById("bus-stop__select__dropdown").style.opacity = 1;
    }

    setToggleDrawer(value);
  };

  // This is used only for the example
  const container = window !== undefined ? () => window().document.body : undefined;

  React.useEffect(() => {
    // $('#bus-stop__select__dropdown').animate({...}, function () {
    //   $('#bus-stop__select__dropdown').css({marginTop: '-=15px'});
    // });
    // document.getElementById('#bus-stop__select__dropdown').animate({marginTop: '-=15px'});
  }, [])
  
  return (
    <div className="swipable-edge-drawer">
      <Root>
        <CssBaseline />
        <Global
          styles={windowDimensions.height > windowDimensions.width && windowDimensions.width <= 600 ? swipableEdgeDrawerStyleVertical() : swipableEdgeDrawerStyleHorizontal()}
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
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <StyledBox
            sx={{
              position: 'absolute',
              top: -drawerBleeding,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              visibility: 'visible',
              right: 0,
              left: 0,
              // top: (windowDimensions.width <= 600 ? -75 : -76),
              top: busStop && windowDimensions.width <= 421 && (busStop.stopName).length > 30  ? -111.5 : -75.5,
              // top: busStop && windowDimensions.width <= 421 && (busStop.stopName).length > 30  ? -111.5 : -144,
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
            {busStop ? <h2 styles={{"text-overflow": "ellipsis"}}>{busStop.stopName}</h2> : <h2>Bus stop</h2>}
          </StyledBox>
          <StyledBox
            sx={{
              px: 0,
              pb: 0,
              height: '100%',
              overflow: 'auto',
            }}
          >
            {busStop != null ? <CallDeparturesTable key={busStop.stopId} busStopId={busStop.stopId} busStopName={busStop.stopName} /> : <></>}
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