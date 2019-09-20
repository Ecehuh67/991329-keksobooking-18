'use strict';

var mapPins = document.querySelector('.map__pins');
var accomodationTemplate = document.querySelector('#pin')
.content.
querySelector('.map__pin');

var ACCOMODATIONS = 8; // Количество объявлений
var AVATARS = 8; //

/*
// Генерация случайного числа
var getRandomData = function(data) {
  return Math.round(Math.random() * data);
};*/

// Создаем функцию для генерации массива случайных чисел
var getRandom = function (amount) {
  var random = [];
  for (var j = 1; j <= amount; j++) {
    random.push(j);
  }
  return random;
};

// Записываем генератор массива чисел в переменную
var randomNumber = getRandom(AVATARS);

//
var getRandomFloat = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Шаблон массива с объявлением
var getAccomodations = function (amount) {
  var accomodation = [];
  for (var i = 0; i < amount; i++) {
    var characteristics = {
      author: 'img/avatars/user' + 0 + randomNumber[i] + '.png',
      offer: {
        title: 'Загружается из данных',
        adress: '500, 500',
        price: 10000,
        type: [],
        rooms: 5,
        guests: 5,
        checkin: '',
        checkout: '',
        features: [],
        description: '',
        photos: []
      },
      location: {
        x: getRandomFloat(10, 630), // Как определить ограничение координат?
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
