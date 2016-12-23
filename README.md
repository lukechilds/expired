# expired

> Calculate when HTTP responses expire from the cache headers

[![Build Status](https://travis-ci.org/lukechilds/expired.svg?branch=master)](https://travis-ci.org/lukechilds/expired) [![Coverage Status](https://coveralls.io/repos/github/lukechilds/expired/badge.svg?branch=master)](https://coveralls.io/github/lukechilds/expired?branch=master)

`expired` accepts HTTP headers as an argument and will return information on when the resource will expire.

## Install

```shell
npm install --save expired
```

## Usage

```js
const expired = require('expired');

const headers = {
  'access-control-allow-origin': '*',
  'age': '0',
  'cache-control': 'public, max-age=300',
  'content-encoding': 'gzip',
  'content-type': 'application/json;charset=utf-8',
  'date': 'Fri, 23 Dec 2016 05:54:31 GMT',
  'last-modified': 'Fri, 23 Dec 2016 05:23:23 GMT',
  'vary': 'Accept-Encoding, User-Agent',
  'via': '1.1 varnish-v4'
};

new Date()
// Date('2016-12-23T05:54:31.000Z')

expired(headers)
// false

expired.in(headers)
// 300000

expired.on(headers)
// Date('2016-12-23T05:59:31.000Z')

delay(500000).then(() => {

  expired(headers)
  // true

  expired.in(headers)
  // -200000

  expired.on(headers)
  // Date('2016-12-23T05:59:31.000Z')

});
```

You can also pass headers in as raw text:

```js
const expired = require('expired');

const headers = `
Access-Control-Allow-Origin: *
Age: 0
Cache-Control: public, max-age=300
Content-Encoding: gzip
Content-Type: application/json;charset=utf-8
Date: Fri, 23 Dec 2016 05:54:31 GMT
Last-Modified: Fri, 23 Dec 2016 05:23:23 GMT
Vary: Accept-Encoding, User-Agent
Via: 1.1 varnish-v4`;

expired(headers)
// false
```

### API

#### expired(headers)

Returns a boolean relating to whether the resource has expired or not. `true` means it's expired, `false` means it's fresh.

#### expired.in(headers)

Returns the amount of milliseconds until the resource will expire. If the resource has already expired it will return a negative integer.

#### expired.on(headers)

Returns a JavaScript `Date` object for the date the resource will expire.

## License

MIT © Luke Childs
