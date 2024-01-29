/**
 * @since 2021-08-22
 * @author vivaxy
 */
const addPxStyleKeys = ['fontSize', 'width', 'height'];

/**
 * @typedef Node
 * @type {string | number | boolean | object}
 * @property {string} tagName
 * @property {object} attrs
 * @property {Node[]} children
 */

/**
 * @deprecated
 * @param {Node} node
 * @return {HTMLParagraphElement|HTMLSpanElement|Text|null}
 */
export default function createElement(node) {
  if (node === null || node === undefined) {
    return null;
  }
  if (
    typeof node === 'string' ||
    typeof node === 'number' ||
    typeof node === 'boolean'
  ) {
    return document.createTextNode(/** @type {string} */ (node));
  }
  const $element = document.createElement(node.tag);
  if (node.attrs) {
    Object.keys(node.attrs).forEach(function (attrKey) {
      const attrValue = node.attrs[attrKey];
      if (attrKey === 'style') {
        Object.keys(attrValue).forEach(function (styleKey) {
          const styleValue = attrValue[styleKey];
          if (
            typeof styleValue === 'number' &&
            addPxStyleKeys.includes(styleKey)
          ) {
            $element.style[styleKey] = `${styleValue}px`;
          } else {
            $element.style[styleKey] = styleValue;
          }
        });
      } else if (attrKey === 'htmlFor') {
        $element.setAttribute('for', attrValue);
      } else {
        $element.setAttribute(attrKey, attrValue);
      }
    });
  }
  if (node.children) {
    node.children.forEach(function (child) {
      const $child = createElement(child);
      if ($child) {
        $element.appendChild($child);
      }
    });
  }

  return $element;
}
