function isIPhone () {
  if (window.navigator.userAgent.indexOf('iPhone') != -1 || window.navigator.userAgent.indexOf('iPad') != -1) {
    // window.alert("true")
    return true
  } else {
    return false
  }
}

export default isIPhone;