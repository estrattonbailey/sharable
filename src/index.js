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
}

/**
 * Receives data to fill 
 * share URLs
 */
var parsedMeta = {};

/**
 * Object.assign() Polyfill
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}

/**
 * Parse metadata from meta tags in head
 */
function parseMeta(){
  var _return = {},
      val,
      props = [],
      head = document.getElementsByTagName('head')[0],
      metaTags = [].slice.call(head.getElementsByTagName('meta'));

  metaTags.forEach(function(tag){
    var attrs = [].slice.call(tag.attributes);

    for (var i = 0; i < attrs.length; i++){
      /** If a Twitter or Open Graph tag */
      if (attrs[i].nodeName.match(/name|property/) && attrs[i].value.match(/twitter|og/)){
        var name = attrs[i].value.split(/\:/)[1];
        /** Push to array of property values */
        props.push({
          name: name, 
          selector: attrs[i].nodeName+'="'+attrs[i].value+'"',
          attr: 'content' 
        });
      }
    }
  });

  /**
   * For each property object,
   * if the corresponding data reference exists,
   * assign the meta tag's value
   */
  for (var i = 0; i < props.length; i++){
    val = head.querySelector('['+props[i].selector+']').getAttribute([props[i].attr]);
    if (val) _return[props[i].name] = val;
  }

  return _return;
}

/**
 * Parse local params from data-social
 * attribute, combine with header meta
 * data and instert into URLs
 *
 * @param {node} target The element that was clicked
 */
function generateURL(target, config){
  var data,
      attr = config.selector.replace(/[\[\]]/g, ''),
      opts = target.getAttribute(attr).split(/\s/),
      network = opts[0],
      locals = opts[1] ? JSON.parse(opts[1]) : {},
      params = networks[network].split(/\|/);

  /** 
   * Join head meta and locals
   */
  data = Object.assign(locals, parsedMeta);

  /**
   * Iterate over each query parameter 
   * in URL. If we have data, insert it.
   * If not, remove the query parameter.
   */
  for (var i = 1; i < params.length; i++){
    var type = params[i].split(/{{|}}/g)[1];
    if (data[type]){
      params[i] = params[i].replace(/{{.*?}}/g, function(str){
        return encodeURI(data[type])
      });
    } else {
      params.splice(i, 1);
      i = i-1; // reset i
    }
  }

  return params.join('');
}

/**
 * Open a popup
 *
 * @param {string} url Url to open
 */
function open(url){
  var width = 500,
      height = 300,
      left = (screen.width / 2) - (width / 2),
      top = (screen.height / 3) - (height / 2);

  window.open(url,'','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width='+width+',height='+height+',top='+top+',left='+left)
}

/**
 * Main export
 *
 * @param {object} opts A optional config to change options
 */
function Social(opts){
  var targets, meta, config;
  
  config = {
    selector: '[data-social]'
  }

  if (typeof opts !== 'object'){
    Object.assign(config, opts)
  } 

  parsedMeta = parseMeta();
  
  targets = Array.prototype.slice.call(document.querySelectorAll(config.selector));

  targets.forEach(function(target, i){
    target.addEventListener('click', function(e){
      e.preventDefault();

      open(generateURL(target, config));
    });
  });
}

return Social;
