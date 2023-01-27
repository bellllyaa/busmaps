function isAndroidFirefox () {
  return window.navigator.userAgent.indexOf('Firefox') !== -1;
}

export default isAndroidFirefox;