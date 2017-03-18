import test from 'ava';
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
		date,
		age: 0,
		'cache-control': `public, max-age=${maxAge}`
	};
	const expiredOn = addSeconds(date, maxAge);

	t.true(isEqual(expired.on(headers), expiredOn));
});

test('expired.on returns correct expirey date for instantly stale cache', t => {
	const date = new Date().toUTCString();
	const headers = {
		date,
		age: 0,
		'cache-control': `public, max-age=0`
	};

	t.true(isEqual(expired.on(headers), date));
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

	t.true(isEqual(expired.on(headers), expiredOn));
});

test('expired.on takes age into account', t => {
	const date = new Date().toUTCString();
	const age = 150;
	const maxAge = 300;
	const headers = {
		date,
		age,
		'cache-control': `public, max-age=${maxAge}`
	};
	const expiredOn = addSeconds(date, (maxAge - age));

	t.true(isEqual(expired.on(headers), expiredOn));
});

test('expired.on uses Expires header', t => {
	const date = new Date().toUTCString();
	const headers = {
		date: addSeconds(date, 300),
		expires: date
	};

	t.true(isEqual(expired.on(headers), date));
});

test('expired.on prefers Cache-Control over Expires header', t => {
	const date = new Date().toUTCString();
	const age = 150;
	const maxAge = 300;
	const headers = {
		date,
		age,
		'cache-control': `public, max-age=${maxAge}`,
		expires: date
	};
	const expiredOn = addSeconds(date, (maxAge - age));

	t.true(isEqual(expired.on(headers), expiredOn));
});
