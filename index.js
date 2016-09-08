import scrape from 'meta-to-object'

const networks = {
  pinterest: ({image = '', url = '', description = ''}) => (
    `https://pinterest.com/pin/create/bookmarklet/?media=${image}&url=${url}&description=${description}`
  ),
  facebook: ({url = ''}) => (
    `http://www.facebook.com/sharer.php?u=${url}`
  ),
  twitter: ({url = '', description = '', via = null, hashtags = ''}) => (
    `https://twitter.com/share?url=${url}&text=${description}${via ? `&via=${via}` : ''}${hashtags ? `&hashtags=${hashtags}` : ''}`
  ),
  tumblr: ({ url = '', title = '', description = '', image = '' }) => (
    `https://www.tumblr.com/widgets/share/tool?posttype=photo&title=${title}&caption=${description}&content=${image}&photo-clickthru=${url}`
  )
}

const merge = (target, ...args) => {
  args.forEach(a => Object.keys(a).forEach(k => target[k] = a[k]))
  return target
}

const openPopup = (url) => {
  let width = 500
  let height = 300
  let left = (screen.width / 2) - (width / 2)
  let top = (screen.height / 3) - (height / 2)

  window.open(url,'','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width='+width+',height='+height+',top='+top+',left='+left)
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
  let network
  let overrides = {}
  let attributes = Array.prototype.slice.call(target.attributes)

  for (let i = 0; i < attributes.length; i++){
    let attr = attributes[i]
    let key = attr.name.split(/data-/)[1] || attr.name 
    attr.name === attribute ? network = attr.value : overrides[key] = attr.value
  }

  return {
    network,
    overrides
  }
}

/**
 * @param {object} config 
 */
function Sharable(config = {}){
  const options = merge({
    selector: 'data-social'
  }, config)

  const instance = Object.create({
    options,
    update
  }, {
    meta: {
      value: scrape({ name: /property|name/, value: /og|twitter/ }),
      writable: true
    }
  })

  /**
   * Init
   */
  bindLinks()

  return instance

  /**
   * Bind new links,
   * fetch new data from head
   */
  function update(){
    bindLinks()
    instance.meta = scrape({ name: /property|name/, value: /og|twitter/ })
  }

  /**
   * Binds links with configured data-attribute selector,
   * then removes the attribute to prevent rebinding
   */
  function bindLinks(){
    const targets = [].slice.call(document.querySelectorAll(`[${options.selector}]`)) || []

    for (let i = 0; i < targets.length; i++){
      let target = targets[i]
      let {network, overrides} = parseLocalData(target, options.selector)
      let meta = merge(instance.meta, overrides)
      let url = networks[network](meta)

      target.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        openPopup(url)
      })

      target.removeAttribute(options.selector)
    }
  }
}

export default Sharable
