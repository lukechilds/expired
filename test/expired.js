const test = require('ava');
const subSeconds = require('date-fns/subSeconds');
const addSeconds = require('date-fns/addSeconds');
const expired = require('..');

test('expired is a function', t => {
	t.is(typeof expired, 'function');
});

test('expired returns false for valid cache', t => {
	const date = new Date(new Date().toUTCString());
	const headers = {
		date: date.toUTCString(),
		age: 0,
		'cache-control': 'public, max-age=300'
	};
	t.false(expired(headers));
});

test('expired returns true for stale cache', t => {
	const date = new Date(new Date().toUTCString());
	const headers = {
		date: subSeconds(new Date(), 500).toUTCString(),
		age: 0,
		'cache-control': 'public, max-age=300'
	};
	t.true(expired(headers, date));
});

test('expired accepts currentDate argument', t => {
	const date = new Date(new Date().toUTCString());
	const headers = {
		date: date.toUTCString(),
		age: 0,
		'cache-control': 'public, max-age=300'
	};
	t.false(expired(headers, date));
	t.true(expired(headers, addSeconds(date, 500)));
});
