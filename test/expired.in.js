import test from 'ava';
import tk from 'timekeeper';
import expired from '../';

test('expired.in is a function', t => {
	t.is(typeof expired.in, 'function');
});

test('expired.in returns positive ms for valid cache', t => {
	const date = new Date().toUTCString();
	const maxAge = 300;
	const headers = {
		date: date,
		age: 0,
		'cache-control': `public, max-age=${maxAge}`
	};

	tk.freeze(date);
	t.is(expired.in(headers), maxAge * 1000);
	tk.reset();
});
