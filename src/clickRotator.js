(function(document, window){
  window.addEventListener('click', function(e) {
    if (e.target.tagName === 'IMG') {
      if (e.detail === 3 || e.shiftKey === true) {
        e.preventDefault();
        rotateImage(e.target);
      }
    }
  });

  function rotateImage(el) {
    el.style.transition = "all .25s ease";
    el.style.transform = "rotate(" + getNextRotation(el.style.transform) +")";
  }

  function getNextRotation(value) {
    if (value === '') { return '90deg'; }
    let filteredNumbers = value.match(/\d+/g);
    if (filteredNumbers) {
      return (Number(filteredNumbers.join()) + 90) + 'deg';
    }
    return '90deg';
  }
})(document, window);
