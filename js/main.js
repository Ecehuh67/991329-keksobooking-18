'use strict';

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

// Показываем карту
document.querySelector('.map').classList.remove('map--faded');

// Создаем метку на карте созгласно шаблона
var renderAccomodation = function (accomodation) {
  var accomodationElement = accomodationTemplate.cloneNode(true);

  accomodationElement.style.left = accomodation.location.x - MAP_PIN_X / 2 + 'px';
  accomodationElement.style.top = accomodation.location.y - MAP_PIN_Y + 'px';
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

// Создаем объявление на карте из шаблона
var renderAdvert = function (advertisment) {
  var advertElement = advertTemplate.cloneNode(true);

  /* var typeOfAccomodation = (advertisment.offer.type === 'flat') ? 'Квартира' : (advertisment.offer.type === 'bungalo') ? 'Бунгало' : (advertisment.offer.type === 'house') ? 'Дом' : 'Дворец'; */

  // Подбираем название типа недвижимости исходя из названия на английском
  var getTypeOfAccomodation = function (object) {
    switch (object.offer.type) {
      case ('bungalo'):
        return 'Бунгало';
      case ('flat'):
        return 'Квартира';
      case ('house'):
        return 'Дом';
      default:
        return 'Дворец';
    }
  };

  advertElement.querySelector('.popup__title').textContent = advertisment.offer.title;
  advertElement.querySelector('.popup__text--address').textContent = advertisment.offer.address;
  advertElement.querySelector('.popup__text--price').textContent = advertisment.offer.price + ' ₽/ночь';
  advertElement.querySelector('.popup__type').textContent = getTypeOfAccomodation(advertisment);
  advertElement.querySelector('.popup__text--capacity').textContent = advertisment.offer.rooms + (advertisment.offer.rooms === 1 ? ' комнатa для ' : ' комнаты для ') + advertisment.offer.guests + (advertisment.offer.guests === 1 ? ' гостя ' : ' гостей');
  advertElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertisment.offer.checkin + ' выезд до ' + advertisment.offer.checkout;

  // Добавляем удобства на карточку объявления исходя из рандомного массива
  var list = advertElement.querySelector('.popup__features');
  list.innerHTML = '';
  for (var j = 0; j < advertisment.offer.features.length; j++) {
    var listItem = document.createElement('li');
    listItem.classList.add('popup__feature--' + advertisment.offer.features[j]);
    listItem.classList.add('popup__feature');
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

  return advertElement;
};

// Создаем буфер куда будем временно копировать объявления
var advert = document.createDocumentFragment();

// Копируем объявление в буфер
advert.appendChild(renderAdvert(accomodations[0]));

// Переносим объявление на карты из буфера
document.querySelector('.map').insertBefore(advert, document.querySelector('.map__filters-container'));
