const test = require('ava');
const addSeconds = require('date-fns/addSeconds');
const isEqual = require('date-fns/isEqual');
const expired = require('..');

test('expired.on is a function', t => {
	t.is(typeof expired.in, 'function');
});

test('expired.on returns correct expirey date for valid cache', t => {
	const date = new Date(new Date().toUTCString());
	const maxAge = 300;
	const headers = {
		date: date.toUTCString(),
		age: 0,
		'cache-control': `public, max-age=${maxAge}`
	};
	const expiredOn = addSeconds(date, maxAge);

	t.true(isEqual(expired.on(headers), expiredOn));
});

test('expired.on returns correct expirey date for instantly stale cache', t => {
	const date = new Date(new Date().toUTCString());
	const headers = {
		date: date.toUTCString(),
		age: 0,
		'cache-control': 'public, max-age=0'
	};

	t.true(isEqual(expired.on(headers), date));
});

test('expired.on returns correct expirey date for stale cache', t => {
	const date = new Date(new Date().toUTCString());
	const dateOffset = -600;
	const maxAge = 300;
	const headers = {
		date: addSeconds(date, dateOffset).toUTCString(),
		age: 0,
		'cache-control': `public, max-age=${maxAge}`
	};
	const expiredOn = addSeconds(date, (maxAge + dateOffset));

	t.true(isEqual(expired.on(headers), expiredOn));
});

test('expired.on takes age into account', t => {
	const date = new Date(new Date().toUTCString());
	const age = 150;
	const maxAge = 300;
	const headers = {
		date: date.toUTCString(),
		age,
		'cache-control': `public, max-age=${maxAge}`
	};
	const expiredOn = addSeconds(date, (maxAge - age));

	t.true(isEqual(expired.on(headers), expiredOn));
});

test('expired.on uses Expires header', t => {
	const date = new Date(new Date().toUTCString());
	const headers = {
		date: addSeconds(date, 300).toUTCString(),
		expires: date.toUTCString()
	};

	t.true(isEqual(expired.on(headers), date));
});

test('expired.on prefers Cache-Control with max-age over Expires header', t => {
	const date = new Date(new Date().toUTCString());
	const expires = new Date(date.getTime() + (100 * 1000));
	const age = 150;
	const maxAge = 300;
	const headers = {
		date: date.toUTCString(),
		age,
		'cache-control': `public, max-age=${maxAge}`,
		expires: expires.toUTCString()
	};
	const expiredOn = addSeconds(date, (maxAge - age));

	t.true(isEqual(expired.on(headers), expiredOn));
});

test('expired.on prefers Cache-Control with no-cache over Expires header', t => {
	const date = new Date(new Date().toUTCString());
	const expires = new Date(date.getTime() + (100 * 1000));
	const age = 150;
	const headers = {
		date: date.toUTCString(),
		age,
		'cache-control': 'no-cache',
		expires: expires.toUTCString()
	};
	t.true(isEqual(expired.on(headers), date));
});

test('expired.on prefers Cache-Control with no-store over Expires header', t => {
	const date = new Date(new Date().toUTCString());
	const expires = new Date(date.getTime() + (100 * 1000));
	const age = 150;
	const headers = {
		date: date.toUTCString(),
		age,
		'cache-control': 'no-store',
		expires: expires.toUTCString()
	};
	t.true(isEqual(expired.on(headers), date));
});

test('expired.on uses Expires header when max-age is not set in Cache-Control', t => {
	const date = new Date(new Date().toUTCString());
	const expires = new Date(date.getTime() + (100 * 1000));
	const age = 150;
	const headers = {
		date: date.toUTCString(),
		age,
		'cache-control': 'public',
		expires: expires.toUTCString()
	};
	t.true(isEqual(expired.on(headers), expires));
});

