/**
 * @since 2021-08-22
 * @author vivaxy
 */
import createElement from '../create-element.js';

function toHTML(node) {
  const $wrap = document.createElement('div');
  $wrap.appendChild(node);
  return $wrap.innerHTML;
}

test('child', function () {
  const node = createElement({
    tag: 'p',
    children: [
      {
        tag: 'span',
        children: ['text'],
      },
    ],
  });
  expect(toHTML(node)).toBe('<p><span>text</span></p>');
});

test('attrs', function () {
  const node = createElement({
    tag: 'p',
    attrs: {
      id: 'm',
    },
  });
  expect(toHTML(node)).toBe('<p id="m"></p>');
});

test('style', function () {
  const node = createElement({
    tag: 'p',
    attrs: {
      style: {
        fontSize: 10,
      },
    },
  });
  expect(toHTML(node)).toBe('<p style="font-size: 10px;"></p>');
});
