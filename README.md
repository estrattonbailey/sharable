# Sharable (WIP, not working rn) [![npm](https://img.shields.io/npm/v/sharable.svg?maxAge=2592000)](https://www.npmjs.com/package/sharable)
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

  <a href="#0" data-social="twitter">Twitter</a>
  <a href="#0" data-social="facebook">Facebook</a>
  <a href="#0" data-social="pinterest">Pinterest</a>
  <a href="#0" data-social="tumblr">Tumblr</a>

</body>
</html>
```
```javascript
import sharable from 'sharable'

const share = sharable({ selector: 'data-social' })
```

## Options 
You can optionally pass extra data to individual links via data attributes to override the default data from the `head`.
```html
<a href="#0" 
  data-social="tumblr"
  data-description="Description for the tumblr post."
  data-url="http://estrattonbailey.tumblr.com"
  >
  Tumblr
</a>
```

## API
#### sharable.update()
Binds any new links and fetches fresh meta data from the `head`.
```javascript
share.update()
```

## TODO
1. More networks (anyone care to contribute?)
2. Tests

* * *

MIT License
