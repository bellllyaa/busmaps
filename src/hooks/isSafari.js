import isIOSChrome from "./isIOSChrome";
import isIOSOpera from "./isIOSOpera";
import isIOSFirefox from "./isIOSFirefox";

function isSafari () {
  // return /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && !isIOSChrome() && !isIOSOpera() && !isIOSFirefox();
}

export default isSafari;