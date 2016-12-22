import test from 'ava'
import expired from '../'

test('expired is a function', t => {
  t.is(typeof expired, 'function')
})
