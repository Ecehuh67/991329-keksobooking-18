// File request.js
'use strict';

(function () {
  var URL = {
    load: 'https://js.dump.academy/keksobooking/data',
    upload: 'https://js.dump.academy/keksobooking'
  };

  var createRequest = function (onSuccess, onError, method, url, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open(method, url);

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError();
      }
    });

    switch (method) {
      case 'GET':
        xhr.send();
        break;
      case 'POST':
        xhr.send(data);
        break;
    }
  };

  // Create function if there is a mistake in an uploading form
  var uploadErrorHandler = function () {
    var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');
    var error = errorTemplate.cloneNode(true);

    // Add the pattern in DOM
    // document.body.querySelector('main').insertAdjacentElement('afterbegin', error);
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

  //
  var uploadSuccessHandler = function () {
    var successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');
    var success = successTemplate.cloneNode(true);

    // Add the pattern in DOM
    // document.body.querySelector('main').insertAdjacentElement('afterbegin', success);
    document.body.querySelector('main').prepend(success);

    window.form.form.reset();

    var avatar = document.querySelector('.ad-form-header__preview img');
    var adPhoto = document.querySelector('.ad-form__photo img');

    var clearSrcImage = function (image) {
      image.src = 'img/muffin-grey.svg';
    };
    clearSrcImage(avatar);
    clearSrcImage(adPhoto);

    var messageSuccess = document.body.querySelector('main .success');

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

    // Find main pin and set it into the first position
    window.render.mainPin.setAttribute('style', 'left: 570px; top: 375px;');
    window.form.getAddress(window.form.MAIN_PIN_X, window.form.MAIN_PIN_Y);

    // Return form to an initial view
    window.render.map.classList.add('map--faded');
    window.form.form.classList.add('ad-form--disabled');

    var filters = document.querySelectorAll('.map__filters select');
    var featuresList = document.querySelector('#housing-features');

    window.form.setOptionDisabled(filters);
    featuresList.setAttribute('disabled', 'disabled');

    window.render.mapPins.prepend(window.render.overlay);

    window.form.formFields.forEach(function (field) {
      field.setAttribute('disabled', 'disabled');
    });

    // Find an opened advert and close it
    window.render.deleteAdvert();

    // Find pins and delete them from map
    var pins = window.render.map.querySelectorAll('.map__pin');
    for (var j = 1; j < pins.length; j++) {
      pins[j].remove();
    }

    // Create a handler for activating form again
    var onMapPinClick = function () {
      window.form.makeFormActive(window.form.formFields);
      window.form.getAddress(window.form.MAIN_PIN_X_ACTIVE, window.form.MAIN_PIN_Y_ACTIVE);
      window.render.mainPin.removeEventListener('click', onMapPinClick);
    };

    // put the handler on the main pin
    window.render.mainPin.addEventListener('click', onMapPinClick);
  };

  window.request = {
    uploadErrorHandler: uploadErrorHandler,
    uploadSuccessHandler: uploadSuccessHandler,
    createRequest: createRequest,
    URL: URL
  };
})();
