'use strict';

(function () {
  var typeOfAccomodation;
  var pins = [];
  var temporary = [];
  var price;
  var rooms;
  var prices = {
    'any': 0,
    'middle': {
      min: 10000,
      max: 50000
    },
    'low': 10000,
    'high': 50000
  };


  var getRangePrice = function (cost) {
    var typeOfPrice;
     if (cost < prices.low ) {
      typeOfPrice = 'low';
    } else if (cost > prices.middle.min && cost < prices.middle.max) {
      typeOfPrice = 'middle';
    } else if (cost > prices.high) {
      typeOfPrice = 'high';
    }
    return typeOfPrice;
  };

  var updatePins = function () {
    //console.log(temporary);
    window.render.render(temporary);
  };

  window.pin.onAccomodationChange = function (type) {
    if (type === 'any') {
      temporary = pins;
    } else {
      temporary = pins.filter(function (pin) {
        return pin.offer.type === type;
      });
    }
    updatePins();
  };

  // window.pin.onPriceChange = function (amount) {
  //
  //   updatePins();
  // };

  window.pin.onRoomsChange = function (room) {
    if (room === 'any') {
      temporary = pins;
    } else {
      temporary = pins.filter(function (pin) {
        return pin.offer.rooms == room;
      });
    }
    updatePins();
  };

  // Callback for rendering pins from server data
  var successHandler = function (data) {
    pins = data;
    temporary = pins;

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
