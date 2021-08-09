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
console.log('<p></p>');
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
try {
  [0].map(function () {
    console.log(NOT_DEFINED);
  });
} catch (e) {
  console.error(e);
}
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
console.assert(false, 1, 2);

// normal timers
console.time();
console.timeLog();
console.timeEnd();

console.timeLog('a');
console.timeEnd('a');
console.time('a');
console.time('a');

// table
console.table(['apples', 'oranges', 'bananas']);

function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

const me = new Person('John', 'Smith');
console.table(me);

const people = [
  ['John', 'Smith'],
  ['Jane', null],
  ['Emily', undefined],
  ['Stephen'],
];
console.table(people);

const john = new Person('John', 'Smith');
const jane = new Person('Jane', 'Doe');
const emily = new Person('Emily', 'Jones');

console.table([john, jane, emily]);

const family = {};

family.mother = new Person('Jane', 'Smith');
family.father = new Person('John', 'Smith');
family.daughter = new Person('Emily', 'Smith');

console.table(family);

console.table([john, jane, emily], ['firstName']);

// circular structure
const circularObject = {};
circularObject.circularObject = circularObject;
console.log(circularObject);
const circularObjectWithArray = {};
circularObjectWithArray.array = [circularObjectWithArray];
console.log(circularObjectWithArray);
const notCircularObject = { a: 1, b: 1 };
console.log(notCircularObject);

// native console
console.nativeConsole.log('only log in browser dev tools');

// new testcase goes here

// uncaught error
throw new Error('UncaughtError');
