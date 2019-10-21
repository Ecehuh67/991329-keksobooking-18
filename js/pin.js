// File pin.js

'use strict';

(function () {
  // Create data for saving list of features
  var data = [];

  var pin = {
    onAccomodationChange: function () {},
    onPriceChange: function () {},
    onRoomsChange: function () {},
    onGuestsChange: function () {},
    onFeaturesChange: function () {}
  };

  // Find all selects and inputs
  var typeOfHouse = document.querySelector('#housing-type');
  var price = document.querySelector('#housing-price');
  var rooms = document.querySelector('#housing-rooms');
  var guests = document.querySelector('#housing-guests');
  var features = document.querySelector('#housing-features');

  // Put a handler on inputs of features
  features.addEventListener('change', function (evt) {
    window.render.deleteAdvert();
    var value = evt.target.value;

    // Define is there a feature in the list or not. If not add it
    if (data.indexOf(value) >= 0) {
      data.splice(data.indexOf(value), 1);
    } else {
      data.push(value);
    }
    pin.onFeaturesChange(data);
  });

  // Put handlers on selects of the filter
  typeOfHouse.addEventListener('change', function (evt) {
    window.render.deleteAdvert();
    var value = evt.target.value;
    pin.onAccomodationChange(value);
  });
  price.addEventListener('change', function (evt) {
    window.render.deleteAdvert();
    var value = evt.target.value;
    pin.onPriceChange(value);
  });
  rooms.addEventListener('change', function (evt) {
    window.render.deleteAdvert();
    var value = evt.target.value;
    pin.onRoomsChange(value);
  });
  guests.addEventListener('change', function (evt) {
    window.render.deleteAdvert();
    var value = evt.target.value;
    pin.onGuestsChange(value);
  });

  window.pin = {
    pin: pin,
    data: data
  };

}());
