import test from 'ava';
import subSeconds from 'date-fns/sub_seconds';
import addSeconds from 'date-fns/add_seconds';
import expired from '../';

test('expired is a function', t => {
	t.is(typeof expired, 'function');
});

test('expired returns false for valid cache', t => {
	const headers = {
		date: new Date().toUTCString(),
		age: 0,
		'cache-control': 'public, max-age=300'
	};

	t.false(expired(headers));
});

test('expired returns true for stale cache', t => {
	const headers = {
		date: subSeconds(new Date(), 500).toUTCString(),
		age: 0,
		'cache-control': 'public, max-age=300'
	};

	t.true(expired(headers));
});

test('expired accepts currentDate argument', t => {
	const date = new Date();
	const headers = {
		date: date.toUTCString(),
		age: 0,
		'cache-control': 'public, max-age=300'
	};

	t.false(expired(headers, date));
	t.true(expired(headers, addSeconds(date, 500)));
});
