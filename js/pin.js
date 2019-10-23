// File pin.js

'use strict';

(function () {
  // Create data for saving list of features
  var data = [];

  var getFeatures = function (input) {
    if (data.indexOf(input) >= 0) {
      data.splice(data.indexOf(input), 1);
    } else {
      data.push(input);
    }

    return data;
  };

  // Create list of features
  var filters = {
    type: {
      handler: function () {},
      link: document.querySelector('#housing-type')
    },
    price: {
      handler: function () {},
      link: document.querySelector('#housing-price')
    },
    rooms: {
      handler: function () {},
      link: document.querySelector('#housing-rooms')
    },
    guests: {
      handler: function () {},
      link: document.querySelector('#housing-guests')
    },
    features: {
      handler: function () {},
      link: document.querySelector('#housing-features')
    }
  };

  // Put a handler on features
  Object.keys(filters).forEach(function (el) {
    filters[el].link.addEventListener('change', function (evt) {
      window.render.deleteAdvert();
      var value = evt.target.value;
      if (filters[el] === filters.features) {
        getFeatures(value);
        filters[el].handler(data);
      } else {
        filters[el].handler(value);
      }
    });
  });

  window.pin = {
    data: data,
    filters: filters
  };

}());
