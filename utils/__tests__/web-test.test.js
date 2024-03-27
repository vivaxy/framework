/**
 * @since 2024-03-27
 * @author vivaxy
 */
console.log = jest.fn();
console.error = jest.fn();
import { test as webTest, expect as webExpect } from '../web-test.js';

test('throw error when call expect not in test function', function () {
  webExpect(1).toBe(1);
  expect(console.error).toHaveBeenCalledWith(
    'Call `expect` in `test` function',
  );
});

test('matcher toBe', function () {
  const testcaseName = 'demo test';
  const received = 1;
  const expected = 2;
  webTest(testcaseName, function () {
    webExpect(received).toBe(expected);
  });
  expect(console.log).toHaveBeenCalledWith('❌', testcaseName);
  expect(console.error).toHaveBeenCalledWith('  Expected:', expected);
  expect(console.error).toHaveBeenCalledWith('  Received:', received);
});

test('matcher toStrictEqual', function () {
  const testcaseName = 'demo test';
  webTest(testcaseName, function () {
    webExpect({ a: 1 }).toStrictEqual({ a: 1 });
  });
  expect(console.log).toHaveBeenCalledWith('✅', testcaseName);

  webTest(testcaseName, function () {
    webExpect({ a: 1 }).toStrictEqual({ a: 1, b: 2 });
  });
  expect(console.log).toHaveBeenCalledWith('❌', testcaseName);
});
