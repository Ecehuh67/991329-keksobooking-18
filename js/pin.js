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

  // Создаем метку на карте созгласно шаблона
  var renderAccomodation = function (accomodation) {
    var accomodationElement = accomodationTemplate.cloneNode(true);

    accomodationElement.style.left = accomodation.location.x - MAP_PIN_X / 2 + 'px';
    accomodationElement.style.top = accomodation.location.y - MAP_PIN_Y + 'px';
    accomodationElement.querySelector('img').setAttribute('src', accomodation.author.avatar);
    accomodationElement.querySelector('img').setAttribute('alt', accomodation.offer.title);

    //
    accomodationElement.addEventListener('click', function () {
      var popup = document.querySelector('.map__card');
      if (popup) {
        popup.parentNode.removeChild(popup);
      }

      window.advert.advert.appendChild(window.advert.renderAdvert(accomodation));
      map.insertBefore(window.advert.advert, map.querySelector('.map__filters-container'));
    });

    return accomodationElement;
  };


  window.pin = {
    renderAccomodation: renderAccomodation,
    map: map,
    mainPin: mainPin,
    mapPins: mapPins,
  };
})();
