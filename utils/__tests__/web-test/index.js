/**
 * @since 2024-03-27
 * @author vivaxy
 */
import { test, expect } from '../../web-test.js';

expect(1).toBe(2);

test('test', function () {
  expect(1).toBe(1);
  expect([0]).toStrictEqual([]);
});
