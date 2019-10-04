// File advert.js
'use strict';

(function () {
  var TRANSLATE_OF_ACCOMODATION = {// Словарь типов имущества
    bungalo: 'Бунгало',
    flat: 'Квартира',
    house: 'Дом',
    palace: 'Дворец'
  };

  var advertTemplate = document.querySelector('#card').
  content.
  querySelector('.map__card'); // Ищем шаблон обявления для пина карты

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
      var popup = document.querySelector('.map__card');
      if (popup) {
        popup.parentNode.removeChild(popup);
      }
      // advertElement.parentNode.removeChild(advertElement);
      document.removeEventListener('keydown', onPopuoCloseEscapePress);
    };
    var onPopuoCloseEscapePress = function (evt) {
      if (evt.keyCode === window.util.ECS_CODE) {
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
  advert.appendChild(renderAdvert(window.data.accomodations[0]));

  window.advert = {
    advert: advert,
    renderAdvert: renderAdvert
  };
})();
