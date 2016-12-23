import test from 'ava';
import tk from 'timekeeper';
import addSeconds from 'date-fns/add_seconds';
import isEqual from 'date-fns/is_equal';
import expired from '../';

test('expired.on is a function', t => {
	t.is(typeof expired.in, 'function');
});

test('expired.on returns correct expirey date for valid cache', t => {
	const date = new Date().toUTCString();
	const maxAge = 300;
	const headers = {
		date: date,
		age: 0,
		'cache-control': `public, max-age=${maxAge}`
	};
	const expiredOn = addSeconds(date, maxAge);

	tk.freeze(date);
	t.true(isEqual(expired.on(headers), expiredOn));
	tk.reset();
});

test('expired.on returns correct expirey date for instantly stale cache', t => {
	const date = new Date().toUTCString();
	const headers = {
		date: date,
		age: 0,
		'cache-control': `public, max-age=0`
	};

	tk.freeze(date);
	t.true(isEqual(expired.on(headers), date));
	tk.reset();
});

test('expired.on returns correct expirey date for stale cache', t => {
	const date = new Date().toUTCString();
	const dateOffset = -600;
	const maxAge = 300;
	const headers = {
		date: addSeconds(date, dateOffset).toUTCString(),
		age: 0,
		'cache-control': `public, max-age=${maxAge}`
	};
	const expiredOn = addSeconds(date, (maxAge + dateOffset));

	tk.freeze(date);
	t.true(isEqual(expired.on(headers), expiredOn));
	tk.reset();
});
