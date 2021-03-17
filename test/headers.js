const test = require('ava');
const isEqual = require('date-fns/isEqual');
const expired = require('..');

test('throw error if header argument is missing', t => {
	const error = t.throws(() => expired());
	t.is(error.message, 'Missing required argument "headers"');
});

test('throw error if Date header is missing', t => {
	const headers = {};
	const error = t.throws(() => expired(headers));
	t.is(error.message, 'Missing required header "Date"');
});

test('headers can be passed in as an object', t => {
	const date = new Date(new Date().toUTCString());
	const headers = {
		date: date.toUTCString(),
		age: 0,
		'cache-control': 'public, max-age=0'
	};
	t.true(isEqual(expired.on(headers), date));
});

test('headers can be passed in as a string', t => {
	const date = new Date(new Date().toUTCString());
	const headers = `
		Date: ${date.toUTCString()}
		Age: 0
		Cache-Control public, max-age=0`;
	t.true(isEqual(expired.on(headers), date));
});

test('headers can contain status code', t => {
	const date = new Date(new Date().toUTCString());
	const headers = `
		HTTP/1.1 200 OK
		Date: ${date.toUTCString()}
		Age: 0
		Cache-Control public, max-age=0`;
	t.true(isEqual(expired.on(headers), date));
});
