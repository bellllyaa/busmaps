import isIOSChrome from "./isIOSChrome";

function isSafari () {
  // return /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && !isIOSChrome();
}

export default isSafari;