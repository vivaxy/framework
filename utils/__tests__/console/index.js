/**
 * @since 2020-02-06 08:58
 * @author vivaxy
 */
import getCallSites from '../../call-sites.js';

const map = new Map();
map.set('key', 'value');

const weakMap = new WeakMap();
weakMap.set({ key: 'value' }, 'value');

const set = new Set();
set.add('item');

const weakSet = new WeakSet();
weakSet.add({ key: 'value' });

console.log('string');
console.log(true);
console.log(0);
console.log(NaN);
console.log(undefined);
console.log(null);
console.log(Symbol('symbol'));
console.log(new Date());
console.log({
  key: 'value',
});
console.log(function fn(a, b) {
  return a + b;
});
console.log(new Error('1'.repeat(100)));
console.log(map);
console.log(weakMap);
console.log(set);
console.log(weakSet);

console.debug('debug');
console.info('info');
console.warn('warn');
console.error('error');

// normal timers
console.time();
console.timeLog();
console.timeEnd();

console.timeLog('a');
console.timeEnd('a');
console.time('a');
console.time('a');

console.log(getCallSites());

throw new Error('UncaughtError');
