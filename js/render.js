// File render.js
'use strict';

(function () {
  var MAP_PIN_X = 50; // Ширина метки на карте
  var MAP_PIN_Y = 70; // Высота метки на карте
  var AMOUNT_OF_ADVERT = 5;

  var map = document.querySelector('.map');
  var overlay = document.querySelector('.map__overlay');
  var mainPin = map.querySelector('.map__pin--main');// Find major pin in the code
  var mapPins = document.querySelector('.map__pins');
  var accomodationTemplate = document.querySelector('#pin')
    .content.
  querySelector('.map__pin'); //  Ищем контент шаблона пина для карты

  var deleteAdvert = function () {
    var popup = document.querySelector('.map__card');
    if (popup) {
      popup.remove();
    }
  };

  var setActivePin = function (object) {
    var activePin = document.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
    object.classList.add('map__pin--active');
  };

  // Put a handler on mainPin to make it actived
  mainPin.addEventListener('click', function () {
    deleteAdvert();
    setActivePin(mainPin);
  });

  // Создаем метку на карте созгласно шаблона
  var renderAccomodation = function (accomodation) {
    var accomodationElement = accomodationTemplate.cloneNode(true);

    accomodationElement.style.left = accomodation.location.x - MAP_PIN_X / 2 + 'px';
    accomodationElement.style.top = accomodation.location.y - MAP_PIN_Y + 'px';
    accomodationElement.querySelector('img').setAttribute('src', accomodation.author.avatar);
    accomodationElement.querySelector('img').setAttribute('alt', accomodation.offer.title);

    // Create a function to show an advert by clicking a pin
    var showAdvert = function () {
      var advert = document.createDocumentFragment();
      advert.prepend(window.advert.render(accomodation));
      map.insertBefore(advert, map.querySelector('.map__filters-container'));
    };

    accomodationElement.addEventListener('click', function () {
      deleteAdvert();
      setActivePin(accomodationElement);
      showAdvert();
    });

    return accomodationElement;
  };

  var getPins = function (data) {
    // Создаем буфер куда будем временно копировать маркеры карты
    var fragment = document.createDocumentFragment();

    var takeNumber = data.length > AMOUNT_OF_ADVERT ? AMOUNT_OF_ADVERT : data.length;
    // Копируем метки в буфер
    for (var i = 0; i < takeNumber; i++) {
      fragment.prepend(renderAccomodation(data[i]));
    }

    mapPins.innerHTML = '';
    mapPins.prepend(mainPin);
    // Render pins on the map from buffer
    mapPins.append(fragment);
  };


  window.render = {
    map: map,
    mainPin: mainPin,
    mapPins: mapPins,
    getPins: getPins,
    deleteAdvert: deleteAdvert,
    overlay: overlay
  };
})();
