// File main.js
'use strict';
(function () {

  var form = document.querySelector('.ad-form');

  var MAIN_PIN_X = 65;
  var MAIN_PIN_Y = 65;
  var MAIN_PIN_X_ACTIVE = 65;
  var MAIN_PIN_Y_ACTIVE = 87;
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
    var pointX = parseInt(window.pin.mainPin.style.left, 10) + pinX / 2;
    if (pinY === MAIN_PIN_Y) {
      var pointY = parseInt(window.pin.mainPin.style.top, 10) + pinY / 2;
    } else {
      pointY = parseInt(window.pin.mainPin.style.top, 10) + pinY;
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
    // Change сoordinates for pin in the field of address
    getAddress(MAIN_PIN_X_ACTIVE, MAIN_PIN_Y_ACTIVE);
    // Render pins on the map from buffer
    window.pin.mapPins.appendChild(window.pin.fragment);
    // Render advert on the map from buffer
    window.pin.map.insertBefore(window.advert.advert, window.pin.map.querySelector('.map__filters-container'));
    window.pin.map.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');
    window.pin.mainPin.removeEventListener('click', activeForm);

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
    }
  };

  // Put a handler on the major pin for click
  window.pin.mainPin.addEventListener('click', activeForm);

  // Put a handler on the major pin for keydownn
  window.pin.mainPin.addEventListener('keydown', onMapPinEnterPress);

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
