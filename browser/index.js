(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sharable = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var enc = function enc(s) {
  return encodeURIComponent(s);
};

var merge = function merge(target) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  args.forEach(function (a) {
    return Object.keys(a).forEach(function (k) {
      return target[k] = a[k];
    });
  });
  return target;
};

var openPopup = function openPopup(url) {
  var width = 500;
  var height = 300;
  var left = screen.width / 2 - width / 2;
  var top = screen.height / 3 - height / 2;

  window.open(url, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=' + width + ',height=' + height + ',top=' + top + ',left=' + left);
};

var networks = {
  pinterest: function pinterest(_ref) {
    var image = _ref.image;
    var url = _ref.url;
    var description = _ref.description;
    return 'https://pinterest.com/pin/create/bookmarklet/?media=' + image + '&url=' + url + '&description=' + enc(description);
  },
  facebook: function facebook(_ref2) {
    var url = _ref2.url;
    return 'http://www.facebook.com/sharer.php?u=' + url;
  },
  twitter: function twitter(_ref3) {
    var url = _ref3.url;
    var description = _ref3.description;
    var via = _ref3.via;
    var hashtags = _ref3.hashtags;
    return 'https://twitter.com/share?url=' + url + '&text=' + enc(description) + (via ? '&via=' + via : '') + (hashtags ? '&hashtags=' + enc(hashtags) : '');
  },
  email: function email(_ref3) {
    var url = _ref3.url;
    var title = _ref3.title;
    return 'mailto?subject=' + title + '&body=' + url;
  },
  tumblr: function tumblr(_ref4) {
    var url = _ref4.url;
    var title = _ref4.title;
    var description = _ref4.description;
    var image = _ref4.image;
    return 'https://www.tumblr.com/widgets/share/tool?posttype=photo&title=' + enc(title) + '&caption=' + enc(description) + '&content=' + image + '&photo-clickthru=' + url;
  }
};

/**
 * Scrape head for all social meta tags
 */
var getMeta = function getMeta() {
  var meta = {};
  var metaTags = [].slice.call(document.head.getElementsByTagName('meta'));

  for (var i = 0; i < metaTags.length; i++) {
    var attributes = [].slice.call(metaTags[i].attributes);

    for (var a = 0; a < attributes.length; a++) {
      var attr = attributes[a];

      if (attr.nodeName.match(/name|property/) && attr.value.match(/twitter|og/)) {
        var property = attr.value.split(/^(\w+\:)/)[2];
        var selector = '[' + attr.nodeName + '="' + attr.value + '"]';

        var propertyValue = document.head.querySelector(selector).getAttribute('content') || false;

        if (propertyValue) meta[property] = propertyValue;
      }
    }
  }

  return meta;
};

/**
 * Get names and values of all data-*
 * attributes on the share link
 *
 * @param {object} target The DOM node representing the social ink
 * @return {object}
 */
var parseLocalData = function parseLocalData(target) {
  return Array.prototype.slice.call(target.attributes).reduce(function (prev, curr) {
    /data-/.test(curr.name) ? prev[curr.name.split(/data-/)[1]] = curr.value : null;
    return prev;
  }, {});
};

exports.default = function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var selector = options.selector || 'data-social';

  var meta = getMeta();

  var update = function update() {
    meta = getMeta();
    bindLinks();
  };

  var bindLinks = function bindLinks() {
    var targets = [].slice.call(document.querySelectorAll('[' + selector + ']')) || [];

    var _loop = function _loop(i) {
      var target = targets[i];
      var network = target.getAttribute(selector);
      var data = merge(meta, parseLocalData(target));
      var url = networks[network](data);

      target.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        openPopup(url);
      };
    };

    for (var i = 0; i < targets.length; i++) {
      _loop(i);
    }
  };

  bindLinks();

  return {
    update: update,
    getMeta: getMeta
  };
};

},{}]},{},[1])(1)
});