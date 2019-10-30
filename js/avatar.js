// File avater.js
'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var createImg = function (link) {
    var image = document.createElement('img');
    image.src = link;
    image.width = '70';
    image.height = '70';
    return image;
  };

  var fileChooser = document.querySelector('#avatar');
  var preview = document.querySelector('.ad-form-header__preview');

  var advertChooser = document.querySelector('#images');
  var adContainer = document.querySelector('.ad-form__photo');

  var addImg = function (link, place) {
    if (place === preview) {
      place.innerHTML = '';
    }
    place.prepend(createImg(link));
  };

  var attachPhoto = function (chooser, container) {
    chooser.addEventListener('change', function () {
      var file = chooser.files;
      if (file) {
        Object.keys(file).forEach(function (key) {
          var fileName = file[key].name.toLowerCase();
          var matches = FILE_TYPES.some(function (type) {
            return fileName.endsWith(type);
          });
          if (matches) {
            var reader = new FileReader();
            reader.addEventListener('load', function () {
              addImg(reader.result, container);
            });
            reader.readAsDataURL(file[key]);
          }
        });
      }
    });
  };

  attachPhoto(fileChooser, preview);
  attachPhoto(advertChooser, adContainer);

  window.avatar = {
    preview: preview,
    adContainer: adContainer
  };
}());
