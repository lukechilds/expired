import test from 'ava';
import tk from 'timekeeper';
import isEqual from 'date-fns/is_equal';
import expired from '../';

test('throw error if header argument is missing', t => {
	const err = t.throws(() => expired());
	t.is(err.message, 'Headers argument is missing');
});

test('throw error if Date header is missing', t => {
	const headers = {};

	const err = t.throws(() => expired(headers));
	t.is(err.message, 'Date header is missing');
});

test('headers can be passed in as an object', t => {
	const date = new Date().toUTCString();
	const headers = {
		date,
		age: 0,
		'cache-control': `public, max-age=0`
	};

	tk.freeze(date);
	t.true(isEqual(expired.on(headers), date));
	tk.reset();
});

test('headers can be passed in as a string', t => {
	const date = new Date().toUTCString();
	const headers = `
		Date: ${date}
		Age: 0
		Cache-Control public, max-age=0`;

	tk.freeze(date);
	t.true(isEqual(expired.on(headers), date));
	tk.reset();
});

test('headers can contain status code', t => {
	const date = new Date().toUTCString();
	const headers = `
		HTTP/1.1 200 OK
		Date: ${date}
		Age: 0
		Cache-Control public, max-age=0`;

	tk.freeze(date);
	t.true(isEqual(expired.on(headers), date));
	tk.reset();
});
