/**
 * @since 2022-03-14
 * @author vivaxy
 */
function NOOP() {}

function now() {
  return (performance || Date).now();
}

/**
 * @callback Fn
 * @param {object} ctx
 */

/**
 * @callback Hook
 * @param {object} ctx
 */

/**
 * @param {Fn} fn
 * @param {{ beforeAll?: Hook, afterAll?: Hook, beforeEach?: Hook, afterEach?: Hook, loop?: number }} options
 * @return {Promise<number>}
 */
export async function run(
  fn,
  {
    beforeAll = NOOP,
    afterAll = NOOP,
    beforeEach = NOOP,
    afterEach = NOOP,
    loop = 100,
  } = {},
) {
  const isAsync = fn.toString().startsWith('async');
  const ctx = {};
  await beforeAll(ctx);
  let cost = 0;
  for (let i = 0; i < loop; i++) {
    ctx.loopIndex = i;
    await beforeEach(ctx);

    const startTime = now();
    if (isAsync) {
      await fn(ctx);
    } else {
      fn(ctx);
    }
    cost += now() - startTime;

    await afterEach(ctx);
  }
  await afterAll(ctx);
  return cost / loop;
}

/**
 * @param {number} base
 * @param {number} current
 * @return {number}
 */
export function getDiff(base, current) {
  return (current - base) / base;
}

/**
 * @param {number} value
 * @param {number} fixed
 * @return {string}
 */
export function toPercentage(value, fixed = 2) {
  return (value * 100).toFixed(fixed) + '%';
}
