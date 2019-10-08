'use strict';

(function () {
  var urlLoad = 'https://js.dump.academy/keksobooking/data';

  // Function for getting data from a server
  var load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open('GET', urlLoad);

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError();
      }
    });

    xhr.send();
  };

  // Callback for rendering pins from server data
  var successHandler = function (pins) {
    // Создаем буфер куда будем временно копировать маркеры карты
    var fragment = document.createDocumentFragment();

    // Копируем метки в буфер
    for (var i = 0; i < pins.length; i++) {
      fragment.appendChild(window.pin.renderAccomodation(pins[i]));
    }

    window.pin.mapPins.appendChild(fragment);
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

  window.request = {
    load: load,
    successHandler: successHandler,
    errorHandler: errorHandler
  };
})();
