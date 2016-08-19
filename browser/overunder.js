(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.overunder = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
 * @param {object} merge Object to merge 
 *
 * @return {object} A *new* object with all props of the passed objects
 */
var merge = function merge(target, _merge) {
  var result = {};
  var props = Object.keys(target);

  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    result[prop] = _merge[prop] ? _merge[prop] : target[prop];
  }

  return result;
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

  for (var _i = 0; _i < metaTags.length; _i++) {
    var attributes = [].slice.call(metaTags[_i].attributes);

    for (var _i = 0; _i < attributes.length; _i++) {
      var attr = attributes[_i];
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
  var raw = target.getAttribute(attribute).split(/\s/);
  var network = raw[0];
  var overrides = raw[1] ? JSON.parse(opts[1]) : null;

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
function createURL(network, meta) {
  var params = networks[network].split(/\|/);

  var replace = function replace(string, value) {
    return string.replace(/{{.*?}}/g, function (str) {
      return encodeURI(value);
    });
  };

  /**
   * Iterate over each query parameter 
   * in URL. If we have data, insert it.
   * If not, remove the query parameter.
   */
  for (var i = 1; i < params.length; i++) {
    var type = params[i].split(/{{|}}/g)[1];

    if (meta[type]) {
      params[i] = replace(params[i], meta[type]);
    } else {
      params.splice(i, 1);
      i = i - 1; // reset i
    }
  }

  return params.join('');
}

/**
 * @param {object} config 
 */
function Sharable(config) {
  var options = merge({
    selector: 'data-social'
  }, config);

  var meta = getMeta();
  var targets = [].slice.call(document.querySelectorAll('[' + options.selector + ']'));

  var _loop = function _loop(i) {
    var target = target[i];

    target.onclick = function (e) {
      e.preventDefault();

      var _parseLocalData = parseLocalData(target, options.selector);

      var network = _parseLocalData.network;
      var overrides = _parseLocalData.overrides;

      var meta = merge(data, overrides);
      var url = createURL(network, meta);
      openPopup(url);
    };
  };

  for (var i = 0; i < targets.length; i++) {
    _loop(i);
  }
}

exports.default = Sharable;

},{}]},{},[1])(1)
});