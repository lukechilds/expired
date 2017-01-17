# expired

> Calculate when HTTP responses expire from the cache headers

[![Build Status](https://travis-ci.org/lukechilds/expired.svg?branch=master)](https://travis-ci.org/lukechilds/expired)
[![Coverage Status](https://coveralls.io/repos/github/lukechilds/expired/badge.svg?branch=master)](https://coveralls.io/github/lukechilds/expired?branch=master)
[![npm](https://img.shields.io/npm/v/expired.svg)](https://www.npmjs.com/package/expired)

`expired` accepts HTTP headers as an argument and will return information on when the resource will expire. `Cache-Control` and `Expires` headers are supported, if both exist `Cache-Control` takes priority ([Why?](http://stackoverflow.com/a/7549558/5625059)).

## Install

```shell
npm install --save expired
```

## Usage

```js
const expired = require('expired');

const headers = `
Age: 0
Cache-Control: public, max-age=300
Content-Encoding: gzip
Content-Type: application/json;charset=utf-8
Date: Fri, 23 Dec 2016 05:50:31 GMT
Last-Modified: Fri, 23 Dec 2016 05:23:23 GMT`;

expired(headers);
// false

expired.in(headers);
// 500000

expired.on(headers);
// Date('2016-12-23T05:55:31.000Z')

delay(600000).then(() => {

  expired(headers);
  // true

  expired.in(headers);
  // -100000

  expired.on(headers);
  // Date('2016-12-23T05:55:31.000Z')

});
```

Many HTTP modules will parse response headers into an object for you. `expired` will also accept headers in this format:

```js
const expired = require('expired');

const headers = {
  'age': '0',
  'cache-control': 'public, max-age=300',
  'content-encoding': 'gzip',
  'content-type': 'application/json;charset=utf-8',
  'date': 'Fri, 23 Dec 2016 05:50:31 GMT',
  'last-modified': 'Fri, 23 Dec 2016 05:23:23 GMT'
};

expired(headers);
// false
```

## Pure Usage

You can make the functions pure by passing in a JavaScript `Date` object to compare to instead of depending on `new Date()`. This isn't necessary for `expired.on` as it doesn't compare dates and is already pure.

The following are all pure functions:

```js
const headers = `...`;
const date = new Date();

expired(headers, date);
expired.in(headers, date);
expired.on(headers);
```

## API

### expired(headers, [date])

Returns a boolean relating to whether the resource has expired or not. `true` means it's expired, `false` means it's fresh.

### expired.in(headers, [date])

Returns the amount of milliseconds from the current date until the resource will expire. If the resource has already expired it will return a negative integer.

### expired.on(headers)

Returns a JavaScript `Date` object for the date the resource will expire.

## License

MIT © Luke Childs
