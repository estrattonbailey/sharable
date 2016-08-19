# Sharable [![npm](https://img.shields.io/npm/v/sharable.svg?maxAge=2592000)](https://www.npmjs.com/package/sharable)
An easily configurable social share libary that uses the social data in your document's `head` by default.

## Install 
```bash
npm i sharable --save
```

## Usage 
Add social data to your `head` as normal.

```html
<html>
<head>
  <meta prefix="og: http://ogp.me/ns#" property="og:description" content="A javascript sandbox, by Eric Bailey."/>
  <meta prefix="og: http://ogp.me/ns#" property="og:site_name" content="Sandbox"/>
  <meta prefix="og: http://ogp.me/ns#" property="og:title" content="Sandbox" />
  <meta prefix="og: http://ogp.me/ns#" property="og:image" content="https://s3.amazonaws.com/StartupStockPhotos/uploads/20160503/3.jpg" />
  <meta prefix="og: http://ogp.me/ns#" property="og:url" content="http://estrattonbailey.com" />

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Sandbox">
  <meta name="twitter:description" content="A javascript sandbox, by Eric Bailey.">
  <meta name="twitter:image" content="https://s3.amazonaws.com/StartupStockPhotos/uploads/20160503/3.jpg">
</head>
<body>

  <a href="#0" data-social="twitter">Twitter</div>
  <a href="#0" data-social="facebook">Facebook</div>
  <a href="#0" data-social="pinterest">Pinterest</div>
  <a href="#0" data-social="tumblr">Tumblr</div>

</body>
</html>
```
```javascript
import sharable from 'sharable'

sharable({ selector: 'data-social' })
```

## Options 
You can optionally pass extra data to individual links to override the default data from the `head`.
```html
<a href="#0" data-social="twitter {"hashtags":"social,tech","via":"estrattonbailey"}">Twitter</div>
<a href="#0" data-social="pinterest {"description":"Custom description!"}">Pinterest</div>
<a href="#0" data-social="pinterest {"image":"custom_image_url"}">Pinterest</div>
```

## TODO
1. More networks (anyone care to contribute?)
2. Tests
3. API: update(), destroy()

* * *

MIT License
