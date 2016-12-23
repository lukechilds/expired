import test from 'ava';
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
