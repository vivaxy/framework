/**
 * @since 2023-11-30
 * @author vivaxy
 */
import { createElement, createText, render, update } from '../index.js';

test('createElement - tagName', function () {
  const element = createElement('div', {}, []);
  expect(element.tagName).toBe('DIV');
});

test('createElement - attributes', function () {
  const element = createElement('div', { class: 'a' }, []);
  expect(element.classList.contains('a')).toBe(true);
});

test('createElement - childNodes', function () {
  const element = createElement('div', {}, [createElement('div')]);
  expect(element.innerHTML).toBe('<div></div>');
});

test('createText', function () {
  const element = createText('text');
  expect(element.textContent).toBe('text');
});

test('render', function () {
  const root = createElement('div');
  const state = {
    count: '1',
  };
  function createApp(state) {
    return createText(state.count);
  }
  render(createApp, state, root);
  expect(root.innerHTML).toBe('1');
});

test('update', function () {
  const root = createElement('div');
  const state = {
    count: '1',
  };
  function createApp(state) {
    return createText(state.count);
  }
  render(createApp, state, root);
  state.count = 2;
  update(createApp, state, root);
  expect(root.innerHTML).toBe('2');
});
