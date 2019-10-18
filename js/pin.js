'use strict';

(function () {
  var pin = {
    onAccomodationChange: function () {},
    onPriceChange: function () {},
    onRoomsChange: function () {},
    onGuestsChange: function () {},
    onFeaturesChange: function () {}
  };

  var typeOfHouse = document.querySelector('#housing-type');
  var price = document.querySelector('#housing-price');
  var rooms = document.querySelector('#housing-rooms');
  var guests = document.querySelector('#housing-guests');
  var features = document.querySelector('#housing-features');

  var filters = {
    typeOfHouse: typeOfHouse.value,
    price: price.value,
    rooms: rooms.value,
    guests: guests.value,
    features: features.value
  };

  typeOfHouse.addEventListener('change', function (evt) {
    var value = evt.target.value;
    pin.onAccomodationChange(value);
  });
  price.addEventListener('change', function (evt) {
    var value = evt.target.value;
    pin.onPriceChange(value);
  });
  rooms.addEventListener('change', function (evt) {
    var value = evt.target.value;
    pin.onRoomsChange(value);
  });
  guests.addEventListener('change', function (evt) {
    var value = evt.target.value;
    pin.onGuestsChange(value);
  });
  features.addEventListener('change', function (evt) {
    var value = evt.target.value;
    pin.onFeaturesChange(value);
  });

  window.pin = pin;
  window.filters = filters;

}());
