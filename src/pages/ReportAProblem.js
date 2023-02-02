import React, { useEffect, useState } from "react";
import Resizer from "react-image-file-resizer";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';

import "./ReportAProblem.css";
import arrowLeftIcon from "../assets/arrow-left.svg";

const LOCAL_URL = "http://localhost:8080";
const HEROKU_PROXY_URL = "https://bypass-cors-error-server.herokuapp.com";
const GOOGLE_PROXY_URL = "https://bypass-cors-server.ew.r.appspot.com";
const PROXY_URL = GOOGLE_PROXY_URL;

const ReportAProblem = () => {

  const theme = useTheme();
  const navigate = useNavigate();
  const navigateTo = (url) => navigate(url);
  const [logsDescription, setLogsDescription] = useState("");
  const [logsPhoto, setLogsPhoto] = useState(null);
  const [logsList, setLogsList] = useState([]);
  const [reportStatus, setReportStatus] = useState(null);

  function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = window.atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], {type: mimeString});
  }

  function compressImage(imgToResize, maxHeight, maxWidth) {

    // let maxSize = 93000;
    let resizeAspect = 0.6;
    // if (imgToResize.size > maxSize) {
    //   resizeAspect = 1 / (imgToResize.size / (maxSize * (maxSize / imgToResize.size) * 1006));
    // }
    // console.log(imgToResize.size/1000, "kB");
    // console.log(maxSize/1000, "kB");
    // console.log(resizeAspect);
    // console.log((maxSize / imgToResize.size) * 1006);

    Resizer.imageFileResizer(
      imgToResize,
      maxHeight * resizeAspect,
      maxWidth * resizeAspect,
      "PNG",
      100,
      0,
      (uri) => {
        // console.log("Resized image successfully");
        // document.getElementById("report-a-problem-chosen-photo").src = uri;
        // console.log(uri);

        // const listOfLogsBlob = new Blob([uri], {type: "application/json"});
        const imgBlob = dataURItoBlob(uri);
    
        // Construct a file
        var file = new File([imgBlob], 'img.png', {
            lastModified: new Date(), // optional - default = now
            type: "image/png" // optional - default = ''
        });

        // console.log(file);
        if (file.size > 10000000) {
          // window.alert("Zdjęcie jest za duże");
          // document.getElementById("report-a-problem-input-photo").value = "";
          // document.getElementById("report-a-problem-chosen-photo").src = "";

          console.log("Image is too large again");
          // console.log(file.size);

          let reader = new FileReader();

          reader.onloadend = function(e) {
            
            let img = new Image;
            img.onload = function() {
              console.log("Compressing the image");
              compressImage(file, img.height, img.width);
            };
            img.src = e.target.result;
            
          }

          reader.readAsDataURL(file);

        } else {
          // console.log("Resized image successfully");
          setLogsPhoto(file);
        }
      },
      "base64"
    );
  
  }

  const handleTextInputChange = (e) => {
    // console.log(e.target.value);
    setLogsDescription(e.target.value);
  };

  function handleImageUpload() {

    console.log("Handling image upload...")

    if ( !( window.File && window.FileReader && window.FileList && window.Blob ) ) {
      alert('The File APIs are not fully supported in this browser.');
      return false;
    }

    let image = document.getElementById("report-a-problem-input-photo").files[0];
    
    if( !( /image/i ).test( image.type ) ) {
          alert( "File "+ image.name +" is not an image." );
          return false;
    }

    try {
      document.querySelector("#report-a-problem-chosen-photo").style.display = "block";
    } catch {}

    let reader = new FileReader();
    console.log(image);

    reader.onloadend = function(e) {
      document.getElementById("report-a-problem-chosen-photo").src = e.target.result;
      // console.log('RESULT', reader.result);
      // setLogsPhoto(reader.result);
      // console.log(image);

      if (image.size > 9000000) {
        console.log("Image is too large");
        // console.log(image.size);

        let img = new Image;
        img.onload = function() {
          compressImage(image, img.height, img.width);
        };
        img.src = reader.result;
      } else {
        setLogsPhoto(image);
      }

       // is the data URL because called with readAsDataURL
    }

    reader.readAsDataURL(image);

  }

  const sendData = () => {
    console.log("Sending the report...");

    const report = {
      description: logsDescription,
      image: logsPhoto,
      logs: logsList
    }
    console.log(report);

    fetch(PROXY_URL + "/get-telebot-token")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data[0] && data[0].ok) {
          const telebot_token = data[0].token;
          const chat_id = data[0].chat_id;

          fetch(
            `https://api.telegram.org/bot${telebot_token}/sendMessage?chat_id=${chat_id}&text=•`
          )
            .then((response) => response.json())
            .then((data) => {
              // console.log(data);
              fetch(
                `https://api.telegram.org/bot${telebot_token}/sendMessage?chat_id=${chat_id}&text=New+problem+reported:`
              )
                .then((response) => response.json())
                .then((data) => {
                  // console.log(data);
                  const formDescription = new FormData();
                  if (report.description === "") {
                    formDescription.append("text", "No description provided");
                  } else {
                    formDescription.append("text", report.description);
                  }
                  fetch(
                    `https://api.telegram.org/bot${telebot_token}/sendMessage?chat_id=${chat_id}`,
                    {
                      method: "POST",
                      body: formDescription,
                    }
                  )
                    .then((response) => response.json())
                    .then((data) => {
                      // console.log(data);

                      if (report.image != null) {
                        const formImage = new FormData();
                        formImage.append("photo", report.image);
                        fetch(
                          `https://api.telegram.org/bot${telebot_token}/sendPhoto?chat_id=${chat_id}`,
                          {
                            method: "POST",
                            body: formImage,
                          }
                        )
                          .then((response) => response.json())
                          .then((data) => {
                            // console.log(data);
                            if (data.error_code) {
                              window.alert("Błąd podczas wysyłania zdjęcia");
                            }
                            const formLogs = new FormData();
                            formLogs.append("document", report.logs);
                            fetch(
                              `https://api.telegram.org/bot${telebot_token}/sendDocument?chat_id=${chat_id}`,
                              {
                                method: "POST",
                                body: formLogs,
                              }
                            )
                              .then((response) => response.json())
                              .then((data) => {
                                // console.log(data);
                                if (data.ok) {
                                  window.alert("Dziękuję!");
                                  navigateTo("/");
                                } else {
                                  window.alert("Błąd podczas wysyłania");
                                  setReportStatus(null);
                                }
                              })
                              .catch((error) => {
                                // console.log(error);
                              });
                          })
                          .catch((error) => {
                            // console.log(error);
                          });
                      } else {
                        const formLogs = new FormData();
                        formLogs.append("document", report.logs);
                        fetch(
                          `https://api.telegram.org/bot${telebot_token}/sendDocument?chat_id=${chat_id}`,
                          {
                            method: "POST",
                            body: formLogs,
                          }
                        )
                          .then((response) => response.json())
                          .then((data) => {
                            // console.log(data);
                            if (data.ok) {
                              window.alert("Dziękuję!");
                              navigateTo("/");
                            } else {
                              window.alert("Błąd podczas wysyłania");
                              setReportStatus(null);
                            }
                          })
                          .catch((error) => {
                            // console.log(error);
                          });
                      }
                    })
                    .catch((error) => {
                      // console.log(error);
                    });
                })
                .catch((error) => {
                  // console.log(error);
                });
            })
            .catch((error) => {
              // console.log(error);
            });
        }
      })
      .catch((error) => {
        // console.log(error);
      });

    // fetch("", {
    //   method: "POST",
    //   // mode: "no-cors",
    //   headers: {
    //     // 'Accept': 'application/json',
    //     "Content-Type": "application/json",
    //     // "Content-Type": "*",
    //   },
    //   body: JSON.stringify(report)
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((error) => {
    //     window.alert('Nie udało się wysłać widomość z tym zdjęciem');
    //     document.getElementById("report-a-problem-input-photo").value = "";
    //     document.getElementById("report-a-problem-chosen-photo").src = "";
    //     setLogsPhoto(null);
    //   })

  }

  useEffect(() => {

    try {
      if (theme.palette.mode === "light") {
        document.querySelectorAll('meta[name="theme-color"]')[0].setAttribute('content', "#ffffff");
      } else {
        document.querySelectorAll('meta[name="theme-color"]')[1].setAttribute('content', "#000000");
      }
    } catch {}

    console.log("Getting all logs...");

    let listOfLogs = [];

    listOfLogs.push(new Date());
    listOfLogs.push(navigator.userAgent);
    
    if (localStorage.getItem("userLocation") != null) {
      listOfLogs.push(JSON.parse(localStorage.getItem("userLocation")));
    }

    if (sessionStorage.getItem("stop_info_logs") != null) {
      listOfLogs.push(JSON.parse(sessionStorage.getItem("stop_info_logs")));
    }

    if (localStorage.getItem("lastOpenedStops") != null) {
      listOfLogs.push(JSON.parse(localStorage.getItem("lastOpenedStops")));
    }

    if (localStorage.getItem("beforeinstallprompt")) {
      listOfLogs.push(JSON.parse(localStorage.getItem("beforeinstallprompt")));
    }

    // setLogsList(listOfLogs);

    const listOfLogsBlob = new Blob([JSON.stringify(listOfLogs)], {type: "application/json"});
    
    // Construct a file
    let file = new File([listOfLogsBlob], 'logs.json', {
        lastModified: new Date(), // optional - default = now
        type: "application/json" // optional - default = ''
    });

    // console.log(file);
    setLogsList(file);
    
  }, [])

  return (
    <div className="report-a-problem__container">
      <div className="report-a-problem__nav">
        <button className="report-a-problem-return-button" onClick={() => {navigateTo("/")}}>
          <img
            src={arrowLeftIcon}
            alt="Close menu button"
          />
        </button>
        <h1>Zgłoś błąd</h1>
      </div>

      <div className="report-a-problem__attach-data">
        <div>
          <h3>Opisz błąd:</h3>
          <input
            id="report-a-problem-input-text"
            type="text"
            placeholder='Np: "wyświetlają się złe godziny przyjazdów"'
            value={logsDescription}
            onChange={handleTextInputChange}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                try {
                  document.querySelector("#report-a-problem-input-text").blur();
                } catch {}
              }
            }}
          ></input>
        </div>
        <div className="report-a-problem-input-photo__container">
          <h3>Masz zrzut ekranu?</h3>
          <img id="report-a-problem-chosen-photo" src="" />
          <button onClick={() => {
            document.querySelector(".report-a-problem-input-photo__container").querySelector("input").click();
          }} >
            Wybierz
            <input
              id="report-a-problem-input-photo"
              type="file" accept="image/png, image/jpeg" //accept="image/*"
              onChange={handleImageUpload}
            />
          </button>
        </div>
        <button
          id="report-a-problem-send-button"
          onClick={() => {
            sendData();
            setReportStatus("sending");
          }}
        >
          {reportStatus === "sending" ? <><div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></> : <h3>Wyślij</h3>}
        </button>
      </div>
    </div>
  )
}

export default ReportAProblem;