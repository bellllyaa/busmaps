function isIOSFirefox () {
  return window.navigator.userAgent.match("FxiOS") !== null;
}

export default isIOSFirefox;