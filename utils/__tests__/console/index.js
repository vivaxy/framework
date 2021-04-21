/**
 * @since 2020-02-06 08:58
 * @author vivaxy
 */
import getCallSites from '../../call-sites.js';

const map = new Map();
map.set('key1', 'value1');
map.set('key2', 'value2');

const weakMap = new WeakMap();
weakMap.set({ key1: 'value1' }, 'value1');
weakMap.set({ key2: 'value2' }, 'value2');

const set = new Set();
set.add('item1');
set.add(2);

const weakSet = new WeakSet();
weakSet.add({ key1: 'value1' });
weakSet.add({ key2: 'value2' });

console.log('string');
console.log(true);
console.log(0);
console.log(NaN);
console.log(undefined);
console.log(null);
console.log([1, 2, 3]);
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
console.log(new File([0], 'MockFile.js'));
console.log(getCallSites());
console.log(document.implementation.createHTMLDocument('test document'));
console.log(document.createElement('p'));

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

// circular structure
const circularObject = {};
circularObject.circularObject = circularObject;
console.log(circularObject);
const notCircularObject = { a: 1, b: 1 };
console.log(notCircularObject);

// new testcase goes here

// uncaught error
throw new Error('UncaughtError');
