var helpers = {
  getShadowDom: function(shadowDom) {
    return shadowDom || document.createElement('div').createShadowRoot();
  },

  ajax: function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI(url));
    xhr.onload = function() {
      if (xhr.status === 200) {
        callback(xhr.response, url);
      } else {
        console.log('Request failed: ' + xhr.status);
        return false;
      }
    };
    xhr.send();
  },

  hasClass: function (el, className) {
      if (el.classList) { return el.classList.contains(className); }
      else { return new RegExp('\\b' + className + '\\b').test(el.className); }
  },

  addClass: function (el, className) {
      if (this.hasClass(el, className)) { return el; }

      el.className = (el.className === '') ? className: el.className + ' ' + className;
      return el;
  },

  removeClass: function (el, className) {
    if (el.classList) { el.classList.remove(className); }
    else { el.className = el.className.split(' ').filter( function(val) { return val !== className; } ).join(' '); }
    return el;
  },

  isElementInViewport: function (el) {
    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  },

  ready: function (fn) {
    if (document.readyState === 'complete') { fn(); }
    else { window.addEventListener('load', fn); }
  }
}
