'use strict';

var mapPins = document.querySelector('.map__pins');
var accomodationTemplate = document.querySelector('#pin')
.content.
querySelector('.map__pin');
var locationX = document.querySelector('.map__overlay').clientWidth;

var ACCOMODATIONS = 8; // Количество объявлений
var TYPE_OF_ACCOMODATION = ['palace', 'flat', 'house', 'bungalo'];
var SCHEDULE = ['12:00', '13:00', '14:00']; // Время заезда - выезда
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator',
  'conditioner']; // Удобства
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']; // Фотографии отеля

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
        price: 10000,
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

// Показываем карту
document.querySelector('.map').classList.remove('map--faded');

// Создаем метку на карте созгласно шаблона
var renderAccomodation = function (accomodation) {
  var accomodationElement = accomodationTemplate.cloneNode(true);

  accomodationElement.style.left = accomodation.location.x + 'px';
  accomodationElement.style.top = accomodation.location.y + 'px';
  accomodationElement.querySelector('img').setAttribute('src', accomodation.author);
  accomodationElement.querySelector('img').setAttribute('alt', accomodation.offer.title);

  return accomodationElement;
};

// Создаем буфер куда будем временно копировать маркеры карты
var fragment = document.createDocumentFragment();

// Копируем метки в буфер
for (var i = 0; i < accomodations.length; i++) {
  fragment.appendChild(renderAccomodation(accomodations[i]));
}

// Переносим маркеры на карту из буфера
mapPins.appendChild(fragment);
