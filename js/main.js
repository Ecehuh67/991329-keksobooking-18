'use strict';

var map = document.querySelector('.map');
var form = document.querySelector('.ad-form');
var mapPins = document.querySelector('.map__pins');
var accomodationTemplate = document.querySelector('#pin')
  .content.
querySelector('.map__pin'); //  Ищем контент шаблона пина для карты
var locationX = document.querySelector('.map__overlay').clientWidth; // Находим ширину карты для границ отрисовки пинов по оси Х
var advertTemplate = document.querySelector('#card').
content.
querySelector('.map__card'); // Ищем шаблон обявления для пина карты

var ACCOMODATIONS = 8; // Количество объявлений
var TYPE_OF_ACCOMODATION = ['palace', 'flat', 'house', 'bungalo'];
var SCHEDULE = ['12:00', '13:00', '14:00']; // Время заезда - выезда
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator',
  'conditioner'
]; // Удобства
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']; // Фотографии отеля
var MAP_PIN_X = 50; // Ширина метки на карте
var MAP_PIN_Y = 70; // Высота метки на карте
var MAIN_PIN_X = 65;
var MAIN_PIN_Y = 65;
var MAIN_PIN_X_ACTIVE = 65;
var MAIN_PIN_Y_ACTIVE = 87;
var TRANSLATE_OF_ACCOMODATION = {// Словарь типов имущества
  bungalo: 'Бунгало',
  flat: 'Квартира',
  house: 'Дом',
  palace: 'Дворец'
};
var MINPRICE_OF_ACCOMODATION = {//
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};
var ENT_CODE = 13; // Keycode of enter button
var ECS_CODE = 27;
var ROOMS_GUESTS_RELATION = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  0: [0]
};
var ROOMS = [1, 2, 3, 0];
var GUESTS = [3, 2, 1, 0];

// Создаем функцию для генерации случайного числа от min до max
var getRandomFloat = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Генерация рандомного массива
var getRandomData = function (object) {

  // Генерируем  рандомную длинну массива
  var randomNumber = getRandomFloat(0, object.length);
  var data = [];
  // Записываем в рандомный массив данные из массива переданного в параметр
  for (var k = 0; k < randomNumber; k++) {
    data.push(object[k]);
  }
  return data;
};

// Шаблон массива с объявлением
var getAccomodations = function (amount) {
  var accomodation = [];
  for (var i = 0; i < amount; i++) {
    var characteristics = {
      author: 'img/avatars/user0' + (i + 1) + '.png',
      offer: {
        title: 'Сдам в аренду ...',
        adress: '500, 500',
        price: getRandomFloat(0, 10000),
        type: TYPE_OF_ACCOMODATION[getRandomFloat(0, TYPE_OF_ACCOMODATION.length)],
        rooms: getRandomFloat(1, 3),
        guests: getRandomFloat(0, 2),
        checkin: SCHEDULE[getRandomFloat(0, SCHEDULE.length)],
        checkout: SCHEDULE[getRandomFloat(0, SCHEDULE.length)],
        features: getRandomData(FEATURES),
        description: 'Что-то нужно написать',
        photos: getRandomData(PHOTOS)
      },
      location: {
        x: getRandomFloat(0, locationX),
        y: getRandomFloat(130, 630)
      }
    };
    accomodation[i] = characteristics;
  }
  return accomodation;
};

var accomodations = getAccomodations(ACCOMODATIONS);

// Показываем карту (temporary it's not active)
// document.querySelector('.map').classList.remove('map--faded');

// Создаем метку на карте созгласно шаблона
var renderAccomodation = function (accomodation) {
  var accomodationElement = accomodationTemplate.cloneNode(true);

  accomodationElement.style.left = accomodation.location.x - MAP_PIN_X / 2 + 'px';
  accomodationElement.style.top = accomodation.location.y - MAP_PIN_Y + 'px';
  accomodationElement.querySelector('img').setAttribute('src', accomodation.author);
  accomodationElement.querySelector('img').setAttribute('alt', accomodation.offer.title);

  //
  accomodationElement.addEventListener('click', function () {

    advert.appendChild(renderAdvert(accomodation));
    map.insertBefore(advert, map.querySelector('.map__filters-container'));
  });

  return accomodationElement;
};

// Создаем буфер куда будем временно копировать маркеры карты
var fragment = document.createDocumentFragment();

// Копируем метки в буфер
for (var i = 0; i < accomodations.length; i++) {
  fragment.appendChild(renderAccomodation(accomodations[i]));
}

// Переносим маркеры на карту из буфера (temporary it's not active)
// mapPins.appendChild(fragment);

// Создаем объявление на карте из шаблона
var renderAdvert = function (advertisment) {
  var advertElement = advertTemplate.cloneNode(true);
  advertElement.querySelector('.popup__title').textContent = advertisment.offer.title;
  advertElement.querySelector('.popup__text--address').textContent = advertisment.offer.address;
  advertElement.querySelector('.popup__text--price').textContent = advertisment.offer.price + ' ₽/ночь';
  advertElement.querySelector('.popup__type').textContent = TRANSLATE_OF_ACCOMODATION[advertisment.offer.type];

  advertElement.querySelector('.popup__text--capacity').textContent = advertisment.offer.rooms + (advertisment.offer.rooms === 1 ? ' комнатa для ' : ' комнаты для ') + advertisment.offer.guests + (advertisment.offer.guests === 1 ? ' гостя ' : ' гостей');
  advertElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertisment.offer.checkin + ' выезд до ' + advertisment.offer.checkout;

  // Добавляем удобства на карточку объявления исходя из рандомного массива
  var list = advertElement.querySelector('.popup__features');
  list.innerHTML = '';
  for (var j = 0; j < advertisment.offer.features.length; j++) {
    var listItem = document.createElement('li');
    listItem.classList.add('popup__feature--' + advertisment.offer.features[j], 'popup__feature');
    list.appendChild(listItem);
  }

  advertElement.querySelector('.popup__description').textContent = advertisment.offer.description;

  // Добавляем фото на карточку объявления исходя из рандомного массива
  var images = advertElement.querySelector('.popup__photos');
  images.innerHTML = '';
  for (var k = 0; k < advertisment.offer.photos.length; k++) {
    var imageItem = document.createElement('img');
    imageItem.classList.add('popup__photo');
    imageItem.setAttribute('src', advertisment.offer.photos[k]);
    imageItem.setAttribute('width', '45');
    imageItem.setAttribute('height', '40');
    imageItem.setAttribute('alt', 'Фотография жилья');
    images.appendChild(imageItem);
  }

  advertElement.querySelector('.popup__avatar').setAttribute('src', advertisment.author);

  // Put on a handler for closing advert
  var buttonPopup = advertElement.querySelector('.popup__close');
  var hidePopup = function () {
    advertElement.parentNode.removeChild(advertElement);
    document.removeEventListener('keydown', onPopuoCloseEscapePress);
  };
  var onPopuoCloseEscapePress = function (evt) {
    if (evt.keyCode === ECS_CODE) {
      hidePopup();
    }
  };

  buttonPopup.addEventListener('click', function () {
    hidePopup();
  });
  document.addEventListener('keydown', onPopuoCloseEscapePress);

  return advertElement;
};

// Создаем буфер куда будем временно копировать объявления
var advert = document.createDocumentFragment();

// Копируем объявление в буфер
advert.appendChild(renderAdvert(accomodations[0]));

// Переносим объявление на карты из буфера (temporary it's not active)
// document.querySelector('.map').insertBefore(advert,  document.querySelector('.map__filters-container'));

// Find form to ban fieldset be edited
var advertFieldset = form.querySelectorAll('fieldset');

// Set 'disabled' on each fieldset of the form
var setOptionDisabled = function (object) {
  for (var j = 0; j < object.length; j++) {
    var fieldsetItem = object[j];
    fieldsetItem.setAttribute('disabled', 'disabled');
  }
};
setOptionDisabled(advertFieldset);

// Find major pin in the code
var mainPin = map.querySelector('.map__pin--main');

// Create function to set address on the map
var getAddress = function (pinX, pinY) {
  var addressInput = document.querySelector('#address');
  var pointX = parseInt(mainPin.style.left, 10) + pinX / 2;
  if (pinY === MAIN_PIN_Y) {
    var pointY = parseInt(mainPin.style.top, 10) + pinY / 2;
  } else {
    pointY = parseInt(mainPin.style.top, 10) + pinY;
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
  // Chenge сoordinates for pin in the field of address
  getAddress(MAIN_PIN_X_ACTIVE, MAIN_PIN_Y_ACTIVE);
  // Render pins on the map from buffer
  mapPins.appendChild(fragment);
  // Render advert on the map from buffer
  map.insertBefore(advert, map.querySelector('.map__filters-container'));
};

// Create function for activating form by pressing Enter
var onMapPinEnterPress = function (evt) {
  if (evt.keyCode === ENT_CODE) {
    mousedown(advertFieldset);
    getAddress(MAIN_PIN_X_ACTIVE, MAIN_PIN_Y_ACTIVE);
  }
};

// Put a handler on the major pin for click
mainPin.addEventListener('click', function () {
  mousedown(advertFieldset);
  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
});

// Put a handler on the major pin for keydownn
mainPin.addEventListener('keydown', onMapPinEnterPress);

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

var deleteSelected = function (object) {
  var objectItem = object.querySelectorAll('option');
  for (var j = 0; j < object.length; j++) {
    objectItem[j].removeAttribute('selected', 'selected');
  }
};

// Create functions for setting selected
var getTimeOut = function () {
  deleteSelected(timeout);
  deleteSelected(timein);
  var index = timein.selectedIndex;
  var timeoutItems = timeout.querySelectorAll('option');
  timeoutItems[index].setAttribute('selected', 'selected');
};

var getTimeIn = function () {
  deleteSelected(timein);
  deleteSelected(timeout);
  var index = timeout.selectedIndex;
  var timeinItems = timein.querySelectorAll('option');
  timeinItems[index].setAttribute('selected', 'selected');
};

// Pun on handlers if timein/timeout are changed
timein.addEventListener('change', function () {
  getTimeOut();
});
timeout.addEventListener('change', function () {
  getTimeIn();
});
