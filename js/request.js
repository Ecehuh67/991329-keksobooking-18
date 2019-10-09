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

    // Render pins on the map from buffer
    window.pin.mapPins.appendChild(fragment);

    // Создаем буфер куда будем временно копировать объявления
    var advert = document.createDocumentFragment();

    // Копируем объявление в буфер
    advert.appendChild(window.advert.renderAdvert(pins[0]));

    // Render advert on the map from buffer
    window.pin.map.insertBefore(advert, window.pin.map.querySelector('.map__filters-container'));

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

  // URL for uploading data on a server
  var urlUpload = 'https://js.dump.academy/keksobooking';

  // Create function which will be able to check status of loading data
  var upload = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError();
      }
    });

    xhr.open('POST', urlUpload);
    xhr.send(data);
  };

  // Create function if there is a mistake in an uploading form
  var uploadErrorHandler = function () {
    var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');
    var error = errorTemplate.cloneNode(true);
    // var errorButton = error.querySelector('.error__button');

    // Add the pattern in DOM
    document.body.querySelector('main').insertAdjacentElement('afterbegin', error);

    // Find the error message to delete it
    var messageError = document.body.querySelector('main .error');

    // Create callback to delete message by click
    var onFormErrorButton = function () {
      messageError.parentNode.removeChild(messageError);
      document.removeEventListener('click', onFormErrorButton);
    };

    // Create callback to delete message by press Escape
    var onFormErrorEscapePress = function (evt) {
      if (evt.keyCode === window.util.ECS_CODE) {
        messageError.parentNode.removeChild(messageError);
        document.removeEventListener('keydown', onFormErrorEscapePress);
      }
    };

    // Add handlers on the form
    document.addEventListener('click', onFormErrorButton);
    document.addEventListener('keydown', onFormErrorEscapePress);
  };

  //
  var uploadSuccessHandler = function () {
    var successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');
    var success = successTemplate.cloneNode(true);

    // Add the pattern in DOM
    document.body.querySelector('main').insertAdjacentElement('afterbegin', success);

    window.form.form.reset();


    var messageSuccess = document.body.querySelector('main .success');

    // Create callback to delete message by click
    var onFormSuccessWindow = function () {
      messageSuccess.parentNode.removeChild(messageSuccess);
      document.removeEventListener('click', onFormSuccessWindow);
    };

    // Create callback to delete message by press Escape
    var onFormSuccessEscapePress = function (evt) {
      if (evt.keyCode === window.util.ECS_CODE) {
        messageSuccess.parentNode.removeChild(messageSuccess);
        document.removeEventListener('keydown', onFormSuccessEscapePress);
      }
    };

    document.addEventListener('click', onFormSuccessWindow);
    document.addEventListener('keydown', onFormSuccessEscapePress);
  };

  window.request = {
    load: load,
    successHandler: successHandler,
    errorHandler: errorHandler,
    upload: upload,
    uploadErrorHandler: uploadErrorHandler,
    uploadSuccessHandler: uploadSuccessHandler
  };
})();
