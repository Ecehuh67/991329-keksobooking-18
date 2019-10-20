// File pin.js
'use strict';

(function () {
  var MAP_PIN_X = 50; // Ширина метки на карте
  var MAP_PIN_Y = 70; // Высота метки на карте

  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');// Find major pin in the code
  var mapPins = document.querySelector('.map__pins');
  var accomodationTemplate = document.querySelector('#pin')
    .content.
  querySelector('.map__pin'); //  Ищем контент шаблона пина для карты

  var deleteAdvert = function () {
    var popup = document.querySelector('.map__card');
    if (popup) {
      popup.parentNode.removeChild(popup);
    }
  };

  // Put a handler on mainPin to make it actived
  mainPin.addEventListener('click', function () {
    var activePin = document.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
    mainPin.classList.add('map__pin--active');

    deleteAdvert();
  });

  // Создаем метку на карте созгласно шаблона
  var renderAccomodation = function (accomodation) {
    var accomodationElement = accomodationTemplate.cloneNode(true);

    accomodationElement.style.left = accomodation.location.x - MAP_PIN_X / 2 + 'px';
    accomodationElement.style.top = accomodation.location.y - MAP_PIN_Y + 'px';
    accomodationElement.querySelector('img').setAttribute('src', accomodation.author.avatar);
    accomodationElement.querySelector('img').setAttribute('alt', accomodation.offer.title);

    //
    accomodationElement.addEventListener('click', function () {
      var activePin = document.querySelector('.map__pin--active');
      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }
      accomodationElement.classList.add('map__pin--active');

      deleteAdvert();

      var advert = document.createDocumentFragment();
      advert.appendChild(window.advert.renderAdvert(accomodation));
      map.insertBefore(advert, map.querySelector('.map__filters-container'));

    });

    return accomodationElement;
  };

  var render = function (data) {
    // Создаем буфер куда будем временно копировать маркеры карты
    var fragment = document.createDocumentFragment();

    var takeNumver = data.length > 5 ? 5 : data.length;
    // Копируем метки в буфер
    for (var i = 0; i < takeNumver; i++) {
      fragment.appendChild(renderAccomodation(data[i]));
    }

    mapPins.innerHTML = '';
    mapPins.appendChild(mainPin);
    // Render pins on the map from buffer
    mapPins.appendChild(fragment);
  };


  window.render = {
    renderAccomodation: renderAccomodation,
    map: map,
    mainPin: mainPin,
    mapPins: mapPins,
    render: render,
    deleteAdvert: deleteAdvert
  };
})();
