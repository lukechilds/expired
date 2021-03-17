const test = require('ava');
const addSeconds = require('date-fns/addSeconds');
const expired = require('..');

test('expired.in is a function', t => {
	t.is(typeof expired.in, 'function');
});

test('expired.in returns positive ms for valid cache', t => {
	const date = new Date(new Date().toUTCString());
	const maxAge = 300;
	const headers = {
		date: date.toUTCString(),
		age: 0,
		'cache-control': `public, max-age=${maxAge}`
	};
	const expiredIn = maxAge * 1000;
	t.is(expired.in(headers, date), expiredIn);
});

test('expired.in returns zero ms for instantly stale cache', t => {
	const date = new Date(new Date().toUTCString());
	const headers = {
		date: date.toUTCString(),
		age: 0,
		'cache-control': 'public, max-age=0'
	};
	const expiredIn = 0;
	t.is(expired.in(headers, date), expiredIn);
});

test('expired.in returns negative ms for stale cache', t => {
	const date = new Date(new Date().toUTCString());
	const dateOffset = -600;
	const maxAge = 300;
	const headers = {
		date: addSeconds(date, dateOffset).toUTCString(),
		age: 0,
		'cache-control': `public, max-age=${maxAge}`
	};
	const expiredIn = (maxAge + dateOffset) * 1000;
	t.is(expired.in(headers, date), expiredIn);
});

test('expired.in accepts currentDate argument', t => {
	const date = new Date(new Date().toUTCString());
	const headers = {
		date: date.toUTCString(),
		age: 0,
		'cache-control': 'public, max-age=300'
	};
	t.is(expired.in(headers, date), 300000);
	t.is(expired.in(headers, addSeconds(date, 500)), -200000);
});
