# Social Share

## Getting Started
1. Ensure all relevant meta data is included in your `<head>`.
```html
<meta prefix="og: http://ogp.me/ns#" property="og:description" content="A javascript sandbox, by Eric Bailey."/>
<meta prefix="og: http://ogp.me/ns#" property="og:site_name" content="Sandbox"/>
<meta prefix="og: http://ogp.me/ns#" property="og:title" content="Sandbox" />
<meta prefix="og: http://ogp.me/ns#" property="og:image" content="https://s3.amazonaws.com/StartupStockPhotos/uploads/20160503/3.jpg" />
<meta prefix="og: http://ogp.me/ns#" property="og:url" content="http://estrattonbailey.com" />

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Sandbox">
<meta name="twitter:description" content="A javascript sandbox, by Eric Bailey.">
<meta name="twitter:image" content="https://s3.amazonaws.com/StartupStockPhotos/uploads/20160503/3.jpg">
```
2. Add `data-social` attribute to share links, with the name of the network that link should share to.
```html
<a href="#0" data-social="twitter">Twitter</div>
```
3. Initiate script:
```javascript
var social = require('path/to/social.min.js'); // not on NPM yet

social({
  // change this if you want
  // must be a data-attribute
  selector: '[data-social]'
});
```
3. That's it! The plugin will open a share dialog when your share link is clicked.

#### Options 
You can optionally pass extra data to the share link.
```html
<a href="#0" data-social="twitter {"hashtags":"social,tech","via":"estrattonbailey"}">Twitter</div>
<a href="#0" data-social="pinterest {"description":"Custom description!"}">Pinterest</div>
<a href="#0" data-social="pinterest {"image":"custom_image_url"}">Pinterest</div>
```
