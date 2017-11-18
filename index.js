const enc = s => encodeURIComponent(s)

const merge = (target, ...args) => {
  args.forEach(a => Object.keys(a).forEach(k => target[k] = a[k]))
  return target
}

const openPopup = url => {
  let width = 500
  let height = 300
  let left = (screen.width / 2) - (width / 2)
  let top = (screen.height / 3) - (height / 2)

  window.open(url,'',`menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=${width},height=${height},top=${top},left=${left}`)
}

const networks = {
  pinterest: ({ image, url, description }) => (
    `https://pinterest.com/pin/create/bookmarklet/?media=${ image }&url=${ url }&description=${ enc(description) }`
  ),
  facebook: ({ url }) => (
    `http://www.facebook.com/sharer.php?u=${ url }`
  ),
  twitter: ({ url, description, via, hashtags }) => (
    `https://twitter.com/share?url=${ url }&text=${ enc(description) }${ via ? `&via=${via}` : '' }${ hashtags ? `&hashtags=${enc(hashtags)}` : '' }`
  ),
  email: ({ url, title }) => (
    `mailto:?subject=${ title }&body=${url}`
  ),
  tumblr: ({ url, title, description, image }) => (
    `https://www.tumblr.com/widgets/share/tool?posttype=photo&title=${ enc(title) }&caption=${ enc(description) }&content=${ image }&photo-clickthru=${ url }`
  )
}

/**
 * Scrape head for all social meta tags
 */
const getMeta = () => {
  let meta = {}
  let metaTags = [].slice.call(document.head.getElementsByTagName('meta'))

  for (let i = 0; i < metaTags.length; i++){
    let attributes = [].slice.call(metaTags[i].attributes);

    for (let a = 0; a < attributes.length; a++){
      let attr = attributes[a]

      if (attr.nodeName.match(/name|property/) && attr.value.match(/twitter|og/)){
        let property = attr.value.split(/^(\w+\:)/)[2]
        let selector = `[${attr.nodeName}="${attr.value}"]`

        let propertyValue = document.head.querySelector(selector).getAttribute('content') || false

        if (propertyValue) meta[property] = propertyValue
      }
    }
  }

  return meta
}

/**
 * Get names and values of all data-*
 * attributes on the share link
 *
 * @param {object} target The DOM node representing the social ink
 * @return {object}
 */
const parseLocalData = target => Array.prototype.slice.call(target.attributes).reduce((prev, curr) => {
  /data-/.test(curr.name) ? prev[curr.name.split(/data-/)[1]] = curr.value : null
  return prev
}, {})

export default (options = {}) => {
  const selector = options.selector || 'data-social'

  let meta = getMeta()

  const update = () => {
    meta = getMeta()
    bindLinks()
  }

  const bindLinks = () => {
    const targets = [].slice.call(document.querySelectorAll(`[${selector}]`)) || []

    for (let i = 0; i < targets.length; i++){
      let target = targets[i]
      let network = target.getAttribute(selector)
      let data = merge(meta, parseLocalData(target))
      let url = networks[network](data)

      target.onclick = e => {
        e.preventDefault()
        e.stopPropagation()
        openPopup(url)
      }
    }
  }

  bindLinks()

  return {
    update,
    getMeta
  }
}
