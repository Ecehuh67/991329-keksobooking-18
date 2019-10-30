// File request.js
'use strict';

(function () {
  var METHODS = {
    get: 'GET',
    post: 'POST'
  };

  var SUCCESS_CODE = 200;
  var AVATAR_SIZE = {
    width: '40',
    height: '44'
  };

  var URL = {
    load: 'https://js.dump.academy/keksobooking/data',
    upload: 'https://js.dump.academy/keksobooking'
  };

  var COORDS_OF_MAIN_PIN = 'left: 570px; top: 375px;';

  var form = document.querySelector('.ad-form');
  var clearFormButton = form.querySelector('.ad-form__reset');

  var errorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');
  var error = errorTemplate.cloneNode(true);

  var successTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');
  var success = successTemplate.cloneNode(true);

  // var avatar = document.querySelector('.ad-form-header__preview img');

  var clearSrcImage = function (image) {
    image.src = 'img/muffin-grey.svg';
    image.width = AVATAR_SIZE.width;
    image.height = AVATAR_SIZE.height;
  };

  var createRequest = function (onSuccess, onError, method, url, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open(method, url);

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onSuccess(xhr.response);
      } else {
        onError();
      }
    });

    switch (method) {
      case METHODS.get:
        xhr.send();
        break;
      case METHODS.post:
        xhr.send(data);
        break;
    }
  };

  // Create function if there is a mistake in an uploading form
  var uploadErrorHandler = function () {
    // Add the pattern in DOM
    document.body.querySelector('main').prepend(error);

    // Find the error message to delete it
    var messageError = document.body.querySelector('main .error');

    // Create callback to delete message by click
    var onFormErrorButton = function () {
      messageError.remove();
      document.removeEventListener('click', onFormErrorButton);
      document.removeEventListener('keydown', onFormErrorEscapePress);
    };

    // Create callback to delete message by press Escape
    var onFormErrorEscapePress = function (evt) {
      if (evt.keyCode === window.util.ECS_CODE) {
        messageError.remove();
        document.removeEventListener('keydown', onFormErrorEscapePress);
        document.removeEventListener('click', onFormErrorButton);
      }
    };

    // Add handlers on the form
    document.addEventListener('click', onFormErrorButton);
    document.addEventListener('keydown', onFormErrorEscapePress);

    // Close an advert if it has been opened
    window.render.deleteAdvert();
  };

  var deletePhoto = function (container) {
    container.innerHTML = '';
  };

  var clearForm = function () {
    // Find main pin and set it into the first position
    window.render.mainPin.setAttribute('style', COORDS_OF_MAIN_PIN);
    window.form.getAddress(window.form.MAIN_PIN_X, window.form.MAIN_PIN_Y);

    // Return form to an initial view
    window.render.map.classList.add('map--faded');
    form.classList.add('ad-form--disabled');

    window.form.setOptionDisabled(window.form.filters);
    window.sorter.filters.features.setAttribute('disabled', 'disabled');

    window.render.mapPins.prepend(window.render.overlay);

    window.form.fields.forEach(function (field) {
      field.setAttribute('disabled', 'disabled');
    });

    // Find an opened advert and close it
    window.render.deleteAdvert();

    // Find pins and delete them from map
    var pins = window.render.map.querySelectorAll('.map__pin');
    for (var i = 1; i < pins.length; i++) {
      pins[i].remove();
    }

    window.form.optionGuests.forEach(function (option) {
      option.removeAttribute('selected');
      if (option.value === '1') {
        option.setAttribute('selected', 'selected');
      }
    });
  };

  clearFormButton.addEventListener('click', function () {
    var avatar = document.querySelector('.ad-form-header__preview img');
    deletePhoto(window.avatar.adContainer);
    clearSrcImage(avatar);
  });

  //
  var uploadSuccessHandler = function () {
    var avatar = document.querySelector('.ad-form-header__preview img');

    // Add the pattern in DOM
    document.body.querySelector('main').prepend(success);
    var messageSuccess = document.body.querySelector('main .success');

    form.reset();
    clearForm();
    deletePhoto(window.avatar.adContainer);
    clearSrcImage(avatar);

    // Create callback to delete message by click
    var onFormSuccessWindow = function () {
      messageSuccess.remove();
      document.removeEventListener('click', onFormSuccessWindow);
      document.removeEventListener('keydown', onFormSuccessEscapePress);
    };

    // Create callback to delete message by press Escape
    var onFormSuccessEscapePress = function (evt) {
      if (evt.keyCode === window.util.ECS_CODE) {
        messageSuccess.remove();
        document.removeEventListener('keydown', onFormSuccessEscapePress);
        document.removeEventListener('click', onFormSuccessWindow);
      }
    };

    document.addEventListener('click', onFormSuccessWindow);
    document.addEventListener('keydown', onFormSuccessEscapePress);

    // Create a handler for activating form again
    var onMapPinClick = function () {
      window.form.isActive = false;
      window.form.makeActive(window.form.fields);
      window.form.getAddress(window.form.MAIN_PIN_X_ACTIVE, window.form.MAIN_PIN_Y_ACTIVE);
      window.render.mainPin.removeEventListener('mousedown', onMapPinClick);
    };

    // put the handler on the main pin
    window.render.mainPin.addEventListener('mousedown', onMapPinClick);
  };

  window.request = {
    uploadErrorHandler: uploadErrorHandler,
    uploadSuccessHandler: uploadSuccessHandler,
    createRequest: createRequest,
    URL: URL,
    METHODS: METHODS,
    error: error
  };
})();
