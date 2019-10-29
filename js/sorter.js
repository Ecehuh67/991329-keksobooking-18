// File sorter.js
'use strict';

(function () {
  var DEFAULT_FILTER = 'any';

  var filters = {
    type: document.querySelector('#housing-type'),
    price: document.querySelector('#housing-price'),
    rooms: document.querySelector('#housing-rooms'),
    guests: document.querySelector('#housing-guests'),
    features: document.querySelector('#housing-features')
  };

  var featuresList = Array.from(filters.features.querySelectorAll('input'));

  // Copy data which was got from the server
  var pins = [];

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

  var updatePins = function () {
    var activeFeatures = featuresList
      .filter(function (feature) {
        return feature.checked;
      })
      .map(function (feature) {
        return feature.value;
      });

    var temporaryPins = pins.filter(function (pin) {
      return Object.keys(filters).every(function (key) {
        if (key === 'features') {
          if (activeFeatures.length) {
            return activeFeatures.every(function (feature) {
              return pin.offer[key].includes(feature);
            });
          }
          return true;
        } else {
          var value = filters[key].value;

          if (value === DEFAULT_FILTER) {
            return true;
          }

          if (key === 'price') {
            return getRangePrice(pin.offer[key]) === value;
          }

          return pin.offer[key].toString() === value;
        }
      });
    });
    window.render.deleteAdvert();
    window.render.getPins(temporaryPins);
  };

  Object.keys(filters).forEach(function (el) {
    filters[el].addEventListener('change', updatePins);
  });


  // Callback for rendering pins from server data
  var successHandler = function (data) {
    pins = data;
    window.render.getPins(pins);
  };

  // Callback for showing a error message if data isn't loaded from server
  var errorHandler = function () {
    // Add the pattern in DOM
    document.body.prepend(window.request.error);
  };

  window.sorter = {
    successHandler: successHandler,
    errorHandler: errorHandler,
    filters: filters
  };

}());
