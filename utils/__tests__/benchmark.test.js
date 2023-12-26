/**
 * @since 2023-12-26
 * @author vivaxy
 */
import { run } from '../benchmark.js';

test('run', async function () {
  const cost = await run(function () {
    let a = 1;
    a++;
  });
  expect(typeof cost).toBe('number');
});

test('hooks', async function () {
  const beforeAll = jest.fn();
  const afterAll = jest.fn();
  const beforeEach = jest.fn();
  const afterEach = jest.fn();
  const loop = 10;
  await run(
    function () {
      let a = 1;
      a++;
    },
    {
      beforeAll,
      afterAll,
      beforeEach,
      afterEach,
      loop,
    },
  );
  expect(beforeAll).toBeCalledTimes(1);
  expect(afterAll).toBeCalledTimes(1);
  expect(beforeEach).toBeCalledTimes(10);
  expect(afterEach).toBeCalledTimes(10);
});
