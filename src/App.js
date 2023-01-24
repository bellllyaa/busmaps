import React, { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Home from "./pages/Home";
import Settings from "./pages/Settings";
import ReportAProblem from "./pages/ReportAProblem";
import About from "./pages/About";

import trips from "./data/trips.json";
import routes from "./data/routes.json";

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

  if (localStorage.getItem("lastUserLocationLat") != null) {
    localStorage.clear();
    sessionStorage.clear();
  }

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
        <div className="App-content" >
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