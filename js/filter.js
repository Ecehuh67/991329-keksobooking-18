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
    var count = 0;
    for (var k = 0; k < listOfFeatures.length; k++) {
      if (range.offer.features.indexOf(listOfFeatures[k])) {
        count += 1;
      }
    }
    if (count === listOfFeatures.length) {
      return count;
    } else {
      return 0;
    }
  };

  // Call the callbacks functions
  window.pin.pin.onAccomodationChange = window.debounce(function (type) {
    filters.type = type;
    updatePins();
  });

  window.pin.pin.onRoomsChange = window.debounce(function (room) {
    filters.rooms = room;
    updatePins();
  });

  window.pin.pin.onGuestsChange = window.debounce(function (guest) {
    filters.guests = guest;
    updatePins();
  });

  window.pin.pin.onPriceChange = window.debounce(function (price) {
    filters.price = price;
    updatePins();
  });

  window.pin.pin.onFeaturesChange = window.debounce(function () {
    filters.features = window.pin.data;
    updatePins();
  });

  // Create a function for filtering pins according to chosen filters and render them
  var updatePins = function () {
    var temporaryPins = pins.filter(function (pin) {
      if (filters.type === 'any') {
        return pin;
      } else {
        return pin.offer.type === filters.type;
      }
    }).filter(function (pin) {
      if (filters.rooms === 'any') {
        return pin;
      } else {
        return pin.offer.rooms === +filters.rooms;
      }
    }).filter(function (pin) {
      if (filters.guests === 'any') {
        return pin;
      } else {
        return pin.offer.guests === +filters.guests;
      }
    }).filter(function (pin) {
      var nameOfRange = getRangePrice(pin.offer.price);
      if (filters.price === 'any') {
        return pin;
      } else {
        return nameOfRange === filters.price;
      }
    }).filter(function (pin) {
      if (filters.features.length === 0) {
        return pin;
      } else if (findOutFeatures(filters.features, pin) > 0) {
        return pin;
      } else {
        return 0;
      }
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
    document.body.insertAdjacentElement('afterbegin', error);
  };

  window.filter = {
    successHandler: successHandler,
    errorHandler: errorHandler
  };

}());
