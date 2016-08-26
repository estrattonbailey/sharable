(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sharable = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Social networks. 
 * Query parameters are separated by '|',
 * values are templated using double-bracket
 * syntax i.e. {{value}}
 */
var networks = {
  pinterest: 'https://pinterest.com/pin/create/bookmarklet/?|media={{image}}|&url={{url}}|&description={{description}}',
  facebook: 'http://www.facebook.com/sharer.php?|u={{url}}',
  twitter: 'https://twitter.com/share?|url={{url}}|&text={{description}}|&via={{via}}|&hashtags={{hashtags}}',
  tumblr: 'https://www.tumblr.com/widgets/share/tool?posttype=photo&title={{title}}&caption={{description}}&content={{image}}&photo-clickthru={{url}}'
};

/**
 * Merge two objects into a 
 * new object
 *
 * @param {object} target Root object
 * @param {object} source Object to merge 
 *
 * @return {object} A *new* object with all props of the passed objects
 */
var merge = function merge(target) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  for (var i = 0; i < args.length; i++) {
    var source = args[i];
    for (var key in source) {
      if (source[key]) target[key] = source[key];
    }
  }

  return target;
};

/**
 * Open a popup
 *
 * @param {string} url Url to open
 */
var openPopup = function openPopup(url) {
  var width = 500;
  var height = 300;
  var left = screen.width / 2 - width / 2;
  var top = screen.height / 3 - height / 2;

  window.open(url, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=' + width + ',height=' + height + ',top=' + top + ',left=' + left);
};

/**
 * Parse metadata from meta tags in head
 *
 * @return {object} Meta data as a js object
 */
var getMeta = function getMeta() {
  var meta = {};
  var head = document.head;
  var metaTags = [].slice.call(head.getElementsByTagName('meta'));

  for (var i = 0; i < metaTags.length; i++) {
    var attributes = [].slice.call(metaTags[i].attributes);

    for (var a = 0; a < attributes.length; a++) {
      var attr = attributes[a];

      /** 
       * If a Twitter or Open Graph tag 
       */
      if (attr.nodeName.match(/name|property/) && attr.value.match(/twitter|og/)) {
        var property = attr.value.split(/\:/)[1];
        var selector = '[' + attr.nodeName + '="' + attr.value + '"]';

        var propertyValue = head.querySelector(selector).getAttribute('content') || false;

        if (propertyValue) meta[property] = propertyValue;
      }
    }
  }

  return meta;
};

/**
 * Parse local params from data-social
 * attribute, combine with header meta
 * data and instert into URLs
 *
 * @param {object} target The DOM node representing the social ink 
 * @param {string} attribute Attribute that contains our data 
 *
 * @return {object} Object with name of network and any optional override values
 */
var parseLocalData = function parseLocalData(target, attribute) {
  var network = void 0;
  var overrides = {};
  var attributes = Array.prototype.slice.call(target.attributes);

  for (var i = 0; i < attributes.length; i++) {
    var attr = attributes[i];
    var key = attr.name.split(/data-/)[1] || attr.name;
    attr.name === attribute ? network = attr.value : overrides[key] = attr.value;
  }

  return {
    network: network,
    overrides: overrides
  };
};

/**
 * @param {string} network Name of social network
 * @param {object} meta Obj containing all necessary meta data from locals and head
 *
 * @return {string} The complete URL based on the template
 */
var createURL = function createURL(network, meta) {
  var params = networks[network].split(/\|/);

  var replace = function replace(string, value) {
    return string.replace(/\{\{.*?\}\}/g, encodeURI(value));
  };

  for (var i = 1; i < params.length; i++) {
    var type = params[i].split(/\{\{|\}\}/g)[1];

    if (meta[type]) {
      params[i] = replace(params[i], meta[type]);
    } else {
      params.splice(i, 1);
      i = i - 1; // reset i
    }
  }

  return params.join('');
};

/**
 * @param {object} config 
 */
function Sharable() {
  var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var options = merge({
    selector: 'data-social'
  }, config);

  var instance = Object.create({
    options: options,
    update: update
  }, {
    meta: {
      value: getMeta(),
      writable: true
    }
  });

  /**
   * Init
   */
  bindLinks();

  return instance;

  /**
   * Bind new links,
   * fetch new data from head
   */
  function update() {
    bindLinks();
    instance.meta = getMeta();
  }

  /**
   * Binds links with configured data-attribute selector,
   * then removes the attribute to prevent rebinding
   */
  function bindLinks() {
    var targets = [].slice.call(document.querySelectorAll('[' + options.selector + ']')) || [];

    if (targets.length < 1) return;

    var _loop = function _loop(i) {
      var target = targets[i];

      var _parseLocalData = parseLocalData(target, options.selector);

      var network = _parseLocalData.network;
      var overrides = _parseLocalData.overrides;

      var url = createURL(network, merge(instance.meta, overrides));

      target.addEventListener('click', function () {
        return openPopup(url);
      });

      target.removeAttribute(options.selector);
    };

    for (var i = 0; i < targets.length; i++) {
      _loop(i);
    }

    return targets;
  }
}

exports.default = Sharable;

},{}]},{},[1])(1)
});