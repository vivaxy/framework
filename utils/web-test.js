/**
 * @since 2024-03-27
 * @author vivaxy
 */
/**
 *
 * @param {*} a
 * @param {*} b
 * @returns {boolean}
 */
function objectEquals(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (Array.isArray(a)) {
    if (a.length !== b.length) {
      return false;
    }
    for (const i in a) {
      if (!objectEquals(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (!objectEquals(aKeys, bKeys)) {
    return false;
  }
  for (const key of aKeys) {
    if (!objectEquals(a[key], b[key])) {
      return false;
    }
  }
  return true;
}

/**
 * @callback Matcher
 * @param {*} value
 * @returns {void}
 */
/**
 *
 * @type {Object.<string, (a: *, b: *) => boolean>}
 */
const matchers = {
  toBe(a, b) {
    return a === b;
  },
  toStrictEqual(a, b) {
    return objectEquals(a, b);
  },
};

let currentDescription = '';

/**
 * @type {(function(any): { toBe: Matcher, toStrictEqual: Matcher })}
 */
export function expect(value) {
  // @ts-ignore
  return Object.keys(matchers).reduce(function (acc, key) {
    return {
      ...acc,
      [key](target) {
        if (!currentDescription) {
          console.error('Call `expect` in `test` function');
          return;
        }
        const isOK = matchers[key](value, target);
        console.log(isOK ? '✅' : '❌', currentDescription);
        if (!isOK) {
          console.error('  Expected:', target);
          console.error('  Received:', value);
        }
      },
    };
  }, {});
}

/**
 * @param {string} description
 * @param {() => void} fn
 */
export function test(description, fn) {
  currentDescription = description || 'test';
  fn();
  currentDescription = '';
}
