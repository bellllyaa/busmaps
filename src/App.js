import React, { useMemo, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Home from "./pages/Home";
import Settings from "./pages/Settings";
import ReportAProblem from "./pages/ReportAProblem";
import About from "./pages/About";

function App() {

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );
  console.log(theme);

  if (localStorage.getItem("lastUserLocationLat") !== null) {
    localStorage.clear();
    sessionStorage.clear();
  }

  if (localStorage.getItem("lastOpenedStops") !== null && !JSON.parse(localStorage.getItem("lastOpenedStops"))[0].providers) {
    localStorage.clear();
    sessionStorage.clear();
  }

  useEffect(() => {

    window.addEventListener('orientationchange', (event) => {
      if (
        window.navigator.userAgent.match(/iPhone/i) //||
        //window.navigator.userAgent.match(/iPad/i)
      ) {
        if (window.innerHeight <= 600) {
          document.querySelector(".MuiPaper-root").style.width = "100vw";
          document.querySelector(".MuiPaper-root").style.left = "0";
        } /*else {
          document.querySelector(".MuiPaper-root").style.width = "600px";
          document.querySelector(".MuiPaper-root").style.left = "calc(50vw - 300px)";
        }*/
        
        // console.log(window.innerHeight);
        // var viewportmeta = document.querySelector('meta[name="viewport"]');
        // if (viewportmeta) {
          // window.location.reload();
          // document.querySelector("html").style.transformOrigin = "0% 0% 0px";
          // viewportmeta.content =
          //   "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
          // document.body.addEventListener(
          //   "gesturestart",
          //   function () {
          //     viewportmeta.content =
          //       "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
          //   },
          //   false
          // );
        // }
      }
    });
  }, [])

  // let busStopAllDepartures = [];
  // fetch("http://api.zdiz.gdynia.pl/pt/stop_times")
  //       .then(response => response.json())
  //       .then(data => {
  //         // console.log(data);
  //         data.map((e) => {
  //           if (e.stopId == 33180) {
  //             e.routeId = trips.find(t => t.tripId === e.tripId)?.routeId;
  //             e.routeShortName = routes.find(r => r.routeId === e.routeId)?.routeShortName;
  //             if (e.routeShortName === "R") {
  //               busStopAllDepartures.push(e)
  //             }
  //             // console.log(e);
  //           }
  //         })
  //         console.log(busStopAllDepartures);
  //       })

  // fetch("http://localhost:8080/?bus-stop-id-static=33180")
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className={`App-content${theme.palette.mode === "light" ? "" : "-theme-dark"}`} >
          <Routes>
            <Route path="/" element={<Home key={theme.palette.mode}/>} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/report-a-problem" element={<ReportAProblem />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;