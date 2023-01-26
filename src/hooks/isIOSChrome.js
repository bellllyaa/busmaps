function isIOSChrome () {
  return window.navigator.userAgent.match("CriOS") !== null;
}

export default isIOSChrome;