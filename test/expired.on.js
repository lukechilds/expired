import test from 'ava';
import expired from '../';

test('expired.on is a function', t => {
	t.is(typeof expired.in, 'function');
});
