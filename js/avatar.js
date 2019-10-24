// File avater.js
'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var createImg = function () {
    var image = document.createElement('img');
    image.src = 'img/muffin-grey.svg';
    image.width = '70';
    image.height = '70';
    return image;
  };

  var fileChooser = document.querySelector('#avatar');
  var preview = document.querySelector('.ad-form-header__preview img');

  var advertChooser = document.querySelector('#images');
  var container = document.querySelector('.ad-form__photo');

  container.prepend(createImg());
  var adPhoto = container.querySelector('img');

  var attachPhoto = function (chooser, photo) {
    chooser.addEventListener('change', function () {
      var file = chooser.files[0];
      if (file) {
        var fileName = file.name.toLowerCase();
        var matches = FILE_TYPES.some(function (it) {
          return fileName.endsWith(it);
        });

        if (matches) {
          var reader = new FileReader();
          reader.addEventListener('load', function () {
            photo.src = reader.result;
          });
          reader.readAsDataURL(file);
        }
      }
    });
  };

  attachPhoto(fileChooser, preview);
  attachPhoto(advertChooser, adPhoto);

}());
