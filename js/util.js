// File util.js
'use strict';

(function () {
  window.util = {
    ENT_CODE: 13, // Keycode of enter button
    ECS_CODE: 27,

    // Генерация рандомного массива
    getRandomData: function (object) {

      // Генерируем  рандомную длинну массива
      var randomNumber = this.getRandomFloat(0, object.length);
      var data = [];
      // Записываем в рандомный массив данные из массива переданного в параметр
      for (var k = 0; k < randomNumber; k++) {
        data.push(object[k]);
      }
      return data;
    },

    // Создаем функцию для генерации случайного числа от min до max
    getRandomFloat: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
  };
})();
