function isStandalone () {
  return window.navigator.standalone === true || (window && window.matchMedia('(display-mode: standalone)').matches);
}

export default isStandalone;