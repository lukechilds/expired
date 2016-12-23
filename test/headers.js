import test from 'ava';
import tk from 'timekeeper';
import isEqual from 'date-fns/is_equal';
import expired from '../';

test('headers can be passed in as an object', t => {
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
