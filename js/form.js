// File main.js
'use strict';
(function () {

  var form = document.querySelector('.ad-form');

  var MAIN_PIN_X = 65;
  var MAIN_PIN_Y = 65;
  var MAIN_PIN_X_ACTIVE = 65;
  var MAIN_PIN_Y_ACTIVE = 81;
  var COORD_Y = {
    min: 130,
    max: 630
  };
  var MINPRICE_OF_ACCOMODATION = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var ROOMS_GUESTS_RELATION = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    0: [0]
  };
  var ROOMS = [1, 2, 3, 0];
  var GUESTS = [3, 2, 1, 0];

  var isActive = false;

  // Find form to ban fieldset be edited
  var advertFieldset = form.querySelectorAll('fieldset');

  // Create a function for setting 'disabled' on fields of the form
  var setOptionDisabled = function (object) {
    for (var j = 0; j < object.length; j++) {
      var fieldsetItem = object[j];
      fieldsetItem.setAttribute('disabled', 'disabled');
    }
  };

  // Set 'disabled' on each fieldset of the form
  setOptionDisabled(advertFieldset);

  // Create function to set address in a form
  var getAddress = function (pinX, pinY) {
    var addressInput = document.querySelector('#address');
    var pointX = Math.round(parseInt(window.pin.mainPin.style.left, 10) + pinX / 2);
    if (pinY === MAIN_PIN_Y) {
      var pointY = Math.round(parseInt(window.pin.mainPin.style.top, 10) + pinY / 2);
    } else {
      pointY = Math.round(parseInt(window.pin.mainPin.style.top, 10) + pinY);
    }
    addressInput.setAttribute('value', pointX + ', ' + pointY);
  };

  // Set address on the inactive map
  getAddress(MAIN_PIN_X, MAIN_PIN_Y);

  // Create function for deleting 'disabled' from each fieldset of the form
  var mousedown = function (object) {
    for (var k = 0; k < object.length; k++) {
      var objectItem = object[k];
      objectItem.removeAttribute('disabled', 'disabled');
    }
    // Render pins on the map from buffer
    window.pin.mapPins.appendChild(window.pin.fragment);
    // Render advert on the map from buffer
    window.pin.map.insertBefore(window.advert.advert, window.pin.map.querySelector('.map__filters-container'));
    window.pin.map.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');
    window.pin.mainPin.removeEventListener('click', activeForm);
    isActive = true;
    return isActive;
  };

  // Put a function in constant for way to delete it from a handler
  var activeForm = function () {
    mousedown(advertFieldset);
  };

  // Create function for activating form by pressing Enter
  var onMapPinEnterPress = function (evt) {
    if (evt.keyCode === window.util.ENT_CODE) {
      mousedown(advertFieldset);
      getAddress(MAIN_PIN_X_ACTIVE, MAIN_PIN_Y_ACTIVE);
      window.pin.mainPin.removeEventListener('keydown', onMapPinEnterPress);
    }
  };

  // Put a handler on the major pin for keydownn
  window.pin.mainPin.addEventListener('keydown', onMapPinEnterPress);

  window.pin.mainPin.addEventListener('mousedown', function (evt) {

    if (!isActive) {
      mousedown(advertFieldset);
    }

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if (window.pin.mainPin.offsetLeft - shift.x + MAIN_PIN_X_ACTIVE / 2 < 0) {
        startCoords.x = '0px' + MAIN_PIN_X_ACTIVE;
        return startCoords.x;

      } else if (window.pin.mainPin.offsetLeft - shift.x + MAIN_PIN_X_ACTIVE / 2 > window.pin.map.clientWidth - MAIN_PIN_X_ACTIVE / 2) {
        startCoords.x = window.pin.map.clientWidth - MAIN_PIN_X_ACTIVE + 'px';
        return startCoords.x;
      }

      if (startCoords.y > COORD_Y.max) {
        startCoords.y = COORD_Y.max + MAIN_PIN_Y_ACTIVE + 'px';

      } else if (startCoords.y < COORD_Y.min) {
        startCoords.y = COORD_Y.min - MAIN_PIN_Y_ACTIVE + 'px';
      }

      window.pin.mainPin.style.top = (window.pin.mainPin.offsetTop - shift.y) + 'px';
      window.pin.mainPin.style.left = (window.pin.mainPin.offsetLeft - shift.x) + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      // Change сoordinates for pin in the field of address
      getAddress(MAIN_PIN_X_ACTIVE, MAIN_PIN_Y_ACTIVE);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Find list of options of rooms
  var selectRooms = document.querySelector('#room_number');
  var optionGuests = document.querySelector('#capacity').querySelectorAll('option');

  // Put disabled on list of guests to avoid bag with 1 room and 1 guest when the page
  // will be opened without changing amount of rooms
  setOptionDisabled(optionGuests);

  // Create a function to cansel disabled on option for choosing guests
  var getAvailableGuests = function () {
    setOptionDisabled(optionGuests);
    var index = selectRooms.selectedIndex;
    var dataGuests = ROOMS_GUESTS_RELATION[ROOMS[index]];
    for (var j = 0; j < GUESTS.length; j++) {
      for (var k = 0; k < dataGuests.length; k++) {
        if (GUESTS[j] === dataGuests[k]) {
          optionGuests[j].removeAttribute('disabled', 'disabled');
        }
      }
    }
  };

  // Put a handler on to control the list of guests
  selectRooms.addEventListener('change', function () {
    getAvailableGuests();
  });

  // Find field of type of accomodation
  var type = document.querySelector('#type');

  // Create a function for defining min price for type of accomodation
  var getMinPriceOfAccomodation = function () {
    var typyOptions = type.querySelectorAll('option');
    var price = document.querySelector('#price');
    var index = type.selectedIndex;
    price.setAttribute('min', MINPRICE_OF_ACCOMODATION[typyOptions[index].value]);
    price.setAttribute('placeholder', MINPRICE_OF_ACCOMODATION[typyOptions[index].value]);
  };

  // Put on a handler if type of accomodation is changed
  type.addEventListener('change', function () {
    getMinPriceOfAccomodation();
  });

  // Create function for cleaning data from selected
  var timein = document.querySelector('#timein');
  var timeout = document.querySelector('#timeout');

  // Pun on handlers if timein/timeout are changed
  timein.addEventListener('change', function () {
    // getTimeOut();
    timeout.value = timein.value;
  });
  timeout.addEventListener('change', function () {
    // getTimeIn();
    timein.value = timeout.value;
  });
})();
