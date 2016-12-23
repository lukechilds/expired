import test from 'ava';
import expired from '../';

test('expired.in is a function', t => {
	t.is(typeof expired.in, 'function');
});
