"use strict";
var $ = require('./libs/jquery');

var App = {
  init: function init() {
    console.log('App initialized.');
    $('body').append('App initialized brunch watch is working?');
  }
};

module.exports = App;
