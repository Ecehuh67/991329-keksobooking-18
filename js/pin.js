'use strict';

(function () {
  var pin = {
    onAccomodationChange: function () {}
  };

  var typeOfHouse = document.querySelector('#housing-type');
  typeOfHouse.addEventListener('change', function (evt) {
    var value = evt.target.value;
    pin.onAccomodationChange(value);
  });

  window.pin = pin;

}());
