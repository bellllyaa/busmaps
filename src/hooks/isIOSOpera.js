function isIOSOpera () {
  return window.navigator.userAgent.match("OPiOS") !== null || window.navigator.userAgent.match("OPT") !== null || window.navigator.userAgent.match("OPX") !== null;
}

export default isIOSOpera;