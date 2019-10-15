'use strict';

(function () {
  var typeOfAccomodation;
  var pins = [];

  var updatePins = function () {
    if (typeOfAccomodation === 'any') {
      window.render.render(pins);
    } else {
      window.render.render(pins.slice().filter(function (pin) {
        return pin.offer.type === typeOfAccomodation;
      }));
    }
  };

  window.pin.onAccomodationChange = function (type) {
    typeOfAccomodation = type;
    updatePins();
  };

  // Callback for rendering pins from server data
  var successHandler = function (data) {
    pins = data;
    window.render.render(data);

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
