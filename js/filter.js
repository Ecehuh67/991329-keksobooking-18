'use strict';

(function () {

  // Copy data which was got from the server
  var pins = [];
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
  window.pin.onAccomodationChange = window.debounce(function (type) {
    filters.type = type;
    updatePins();
  });

  window.pin.onRoomsChange = window.debounce(function (room) {
    filters.rooms = room;
    updatePins();
  });

  window.pin.onGuestsChange = window.debounce(function (guest) {
    filters.guests = guest;
    updatePins();
  });

  window.pin.onPriceChange = window.debounce(function (price) {
    filters.price = price;
    updatePins();
  });

  window.pin.onFeaturesChange = window.debounce(function () {
    filters.features = window.data;
    updatePins();
  });

  // Create a function for filtering pins according to chosen filters and render them
  var updatePins = function () {
    var temporary = pins.filter(function (pin) {
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
    window.render.render(temporary);
  };

  // Callback for rendering pins from server data
  var successHandler = function (data) {
    pins = data;
    window.render.render(pins);

    // Создаем буфер куда будем временно копировать объявления
    var advert = document.createDocumentFragment();

    // Копируем объявление в буфер
    advert.appendChild(window.advert.renderAdvert(data[0]));

    // Render advert on the map from buffer
    window.render.map.insertBefore(advert, window.render.map.querySelector('.map__filters-container'));

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

    // Delete ad which had rendered in first time
    var firstAdvert = document.querySelector('.map__card');
    firstAdvert.parentNode.removeChild(firstAdvert);
  };

  window.filter = {
    successHandler: successHandler,
    errorHandler: errorHandler
  };

}());
