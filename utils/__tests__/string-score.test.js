/**
 * @since 2024-03-11
 * @author vivaxy
 */
import { stringScore } from '../string-score.js';

/**
 * @param {string} keyword1
 * @param {string} keyword2
 * @param {string} input
 */
function weightHigherThan(keyword1, keyword2, input) {
  const { weight: w1, matched: m1 } = stringScore(keyword1, input);
  const { weight: w2, matched: m2 } = stringScore(keyword2, input);
  if (w1 <= w2) {
    console.log(w1, w2, m1.slice(1), m2.slice(1));
  }
  expect(w1 > w2).toBe(true);
}

/**
 * @param {string} keyword
 * @param {string} input
 */
function shouldNotMatch(keyword, input) {
  const { weight } = stringScore(keyword, input);
  expect(weight).toBe(0);
}

test('weight is higher if input is target', function () {
  weightHigherThan('table', 'table_x', 'table');
  weightHigherThan('table', 'x_table', 'table');
  weightHigherThan('table', 'x_table_x', 'table');
  weightHigherThan('table', 'ta_x_ble', 'table');
});

test('weight is higher if matched is in sequence', function () {
  weightHigherThan('x_table', 'ta_x_ble', 'table');
  weightHigherThan('table_x', 'ta_x_ble', 'table');
  weightHigherThan('x_table_x', 'ta_x_ble', 'table');
  weightHigherThan('t_x_able', 'ta_x_ble', 'table');
});

test('weight is higher if matched is in the front', function () {
  weightHigherThan('x_table', 'xx_table', 'table');
  weightHigherThan('tab_x_le', 'ta_x_ble', 'table');
});

test('RegExp is escaped properly', function () {
  shouldNotMatch('table', '.able');
  shouldNotMatch('table', '*');
});
