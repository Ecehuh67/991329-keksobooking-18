// File filter.js
'use strict';

(function () {

  // Copy data which was got from the server
  var pins = [];

  // Create dictionary of filters which helps to sort pins on the map
  var filters = {
    type: 'any',
    rooms: 'any',
    guests: 'any',
    price: 'any',
    features: []
  };

  // Create a dictionary for getting a range of price
  var prices = {
    'middle': {
      min: 10000,
      max: 50000
    },
    'low': 9999,
    'high': 50000
  };

  // Create a function to get a name of a range of a price
  var getRangePrice = function (cost) {
    var typeOfPrice;
    if (cost <= prices.low) {
      typeOfPrice = 'low';
    } else if (cost >= prices.middle.min && cost <= prices.middle.max) {
      typeOfPrice = 'middle';
    } else if (cost > prices.high) {
      typeOfPrice = 'high';
    }

    return typeOfPrice;
  };

  // Create a function for comparing features from list to pins
  var findOutFeatures = function (listOfFeatures, range) {
    return listOfFeatures.every(function (feature) {
      return range.includes(feature);
    });
  };

  // Call the callbacks functions
  Object.keys(window.pin.filters).forEach(function (el) {
    window.pin.filters[el].handler = window.debounce(function (select) {
      filters[el] = select;
      updatePins();
    });
  });

  var compareThings = function (clause, value) {
    if (clause === 'any') {
      return true;
    } else {
      return value.toString() === clause;
    }
  };

  // Create a function for filtering pins according to chosen filters and render them
  var updatePins = function () {
    var temporaryPins = pins.filter(function (pin) {
      return compareThings(filters.type, pin.offer.type);
    }).filter(function (pin) {
      return findOutFeatures(filters.features, pin.offer.features);
    }).filter(function (pin) {
      return compareThings(filters.rooms, pin.offer.rooms);
    }).filter(function (pin) {
      return compareThings(filters.guests, pin.offer.guests);
    }).filter(function (pin) {
      return compareThings(filters.price, getRangePrice(pin.offer.price));
    });
    window.render.render(temporaryPins);
  };

  // Callback for rendering pins from server data
  var successHandler = function (data) {
    pins = data;
    window.render.render(pins);
  };

  // Callback for showing a error message if data isn't loaded from server
  var errorHandler = function () {

    // Find pattern for rendering error message
    var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

    var error = errorTemplate.cloneNode(true);

    // Add the pattern in DOM
    document.body.prepend(error);
  };

  window.filter = {
    successHandler: successHandler,
    errorHandler: errorHandler
  };

}());
