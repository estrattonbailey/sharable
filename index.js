/**
 * Social networks. 
 * Query parameters are separated by '|',
 * values are templated using double-bracket
 * syntax i.e. {{value}}
 */
const networks = {
	pinterest: 'https://pinterest.com/pin/create/bookmarklet/?|media={{image}}|&url={{url}}|&description={{description}}',
	facebook: 'http://www.facebook.com/sharer.php?|u={{url}}',
  twitter: 'https://twitter.com/share?|url={{url}}|&text={{description}}|&via={{via}}|&hashtags={{hashtags}}',
  tumblr: 'https://www.tumblr.com/widgets/share/tool?posttype=photo&title={{title}}&caption={{description}}&content={{image}}&photo-clickthru={{url}}'
}

/**
 * Merge two objects into a 
 * new object
 *
 * @param {object} target Root object
 * @param {object} source Object to merge 
 *
 * @return {object} A *new* object with all props of the passed objects
 */
const merge = (target, source) => {
  let result = {}
  let props = Object.keys(target)

  for (let i = 0; i < props.length; i++){
    let prop = props[i]
    result[prop] = source[prop] ? source[prop] : target[prop]
  }

  return result
}

/**
 * Open a popup
 *
 * @param {string} url Url to open
 */
const openPopup = (url) => {
  let width = 500
  let height = 300
  let left = (screen.width / 2) - (width / 2)
  let top = (screen.height / 3) - (height / 2)

  window.open(url,'','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width='+width+',height='+height+',top='+top+',left='+left)
}

/**
 * Parse metadata from meta tags in head
 *
 * @return {object} Meta data as a js object
 */
const getMeta = () => {
  let meta = {}
  let head = document.head
  let metaTags = [].slice.call(head.getElementsByTagName('meta'))

  for (let i = 0; i < metaTags.length; i++){
    let attributes = [].slice.call(metaTags[i].attributes);

    for (let a = 0; a < attributes.length; a++){
      let attr = attributes[a]

      /** 
       * If a Twitter or Open Graph tag 
       */
      if (attr.nodeName.match(/name|property/) && attr.value.match(/twitter|og/)){
        let property = attr.value.split(/\:/)[1];
        let selector = `[${attr.nodeName}="${attr.value}"]`

        let propertyValue = head.querySelector(selector).getAttribute('content') || false

        if (propertyValue) meta[property] = propertyValue
      }
    }
  }

  return meta;
}

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
const parseLocalData = (target, attribute) => {
  let raw = target.getAttribute(attribute).split(/\s{1}/)
  let network = raw[0]
  let overrides = raw[1] ? JSON.parse(raw[1]) : null 

  return {
    network,
    overrides
  }
}

/**
 * @param {string} network Name of social network
 * @param {object} meta Obj containing all necessary meta data from locals and head
 *
 * @return {string} The complete URL based on the template
 */
const createURL = (network, meta) => {
  let params = networks[network].split(/\|/)

  const replace = (string, value) => {
    string.replace(/\{\{.*?\}\}/g, encodeURI(value))
  }

  /**
   * Iterate over each query parameter 
   * in URL. If we have data, insert it.
   * If not, remove the query parameter.
   */
  for (let i = 1; i < params.length; i++){
    let type = params[i].split(/\{\{|\}\}/g)[1]

    if (meta[type]){
      params[i] = replace(params[i], meta[type])
    } else {
      params.splice(i, 1);
      i = i-1; // reset i
    }
  }

  return params.join('');
}

/**
 * @param {object} config 
 */
function Sharable(config = {}){
  const options = merge({
    selector: 'data-social'
  }, config)

  const meta = getMeta();
  const targets = [].slice.call(document.querySelectorAll(`[${options.selector}]`)) || []

  for (let i = 0; i < targets.length; i++){
    let target = targets[i]

    target.onclick = (e) => {
      e.preventDefault()
      let {network, overrides} = parseLocalData(target, options.selector)
      let meta = merge(data, overrides)
      let url = createURL(network, meta)
      openPopup(url)
    }
  }
}

export default Sharable

