/**
 * @since 2023-11-30
 * @author vivaxy
 */
import { createElement, createText, render } from '../render-app.js';

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
  const props = {
    count: '1',
  };

  function createApp(props) {
    return createText(props.count);
  }

  render(createApp, props, root);
  expect(root.innerHTML).toBe('1');
});

test('render twice', function () {
  const root = createElement('div');
  let props = {
    count: 1,
  };

  function createApp(props) {
    return createText(props.count);
  }

  render(createApp, props, root);
  props = {
    ...props,
    count: 2,
  };
  render(createApp, props, root);
  expect(root.innerHTML).toBe('2');
});

test('update props with functions on props', function () {
  const root = createElement('div');
  let props = {
    count: 1,
    add() {
      props = {
        ...props,
        count: props.count + 1,
      };
      renderApp();
    },
  };

  function renderApp() {
    render(createApp, props, root);
  }

  function createApp(props) {
    return createText(props.count);
  }

  renderApp();
  props.add();
  expect(root.innerHTML).toBe('2');
});
