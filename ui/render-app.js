/**
 * @since 2023-11-30
 * @author vivaxy
 */
/**
 * @typedef RenderAppElement
 * @type {HTMLElement | Text}
 */

/**
 * @typedef ArrayLikeElements
 * @type {NodeListOf<RenderAppElement>|Array<RenderAppElement>}
 */
/**
 *
 * @param {string} tagName
 * @param {object} attributes
 * @param {ArrayLikeElements} childNodes
 * @return {*}
 */
export function createElement(tagName, attributes = {}, childNodes = []) {
  const element = document.createElement(tagName);
  Object.keys(attributes).forEach(function (key) {
    const value = attributes[key];
    if (typeof value === 'boolean') {
      element[key] = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  childNodes.forEach(function (child) {
    element.appendChild(child);
  });
  return element;
}

/**
 *
 * @param {string} text
 * @return {Text}
 */
export function createText(text) {
  return document.createTextNode(text);
}

/**
 *
 * @param {ArrayLikeElements} newChildNodes
 * @param {ArrayLikeElements} oldChildNodes
 */
function updateElementChildNodes(newChildNodes, oldChildNodes) {
  let i = 0;
  const { parentNode } = oldChildNodes[0];
  for (; i < oldChildNodes.length; ) {
    const newChildNode = newChildNodes[i];
    if (newChildNode) {
      updateElement(newChildNode, oldChildNodes[i]);
      i++;
    } else {
      parentNode.removeChild(oldChildNodes[i]);
    }
  }
  for (; i < newChildNodes.length; ) {
    parentNode.appendChild(newChildNodes[i]);
  }
}

/**
 *
 * @param {RenderAppElement} newElement
 * @param {RenderAppElement} oldElement
 * @return {boolean}
 */
function updateElement(newElement, oldElement) {
  if (
    newElement.nodeType !== oldElement.nodeType ||
    newElement.tagName !== oldElement.tagName
  ) {
    oldElement.parentNode.replaceChild(newElement, oldElement);
    return true;
  }
  if (newElement.nodeType === Node.TEXT_NODE) {
    if (newElement.textContent !== oldElement.textContent) {
      oldElement.textContent = newElement.textContent;
    }
    return true;
  }
  for (const { name, value } of newElement.attributes) {
    if (oldElement.getAttribute(name) !== value) {
      oldElement.setAttribute(name, value);
    }
  }
  for (const { name, value } of oldElement.attributes) {
    const newElementValue = newElement.getAttribute(name);
    if (newElementValue !== value) {
      oldElement.setAttribute(name, newElementValue);
    }
  }
  ['checked', 'disabled'].forEach(function (key) {
    if (newElement[key] !== oldElement[key]) {
      oldElement[key] = newElement[key];
    }
  });
  if (!oldElement.childNodes.length && newElement.childNodes.length) {
    while (newElement.childNodes.length) {
      oldElement.appendChild(newElement.childNodes[0]);
    }
    return true;
  }
  if (oldElement.childNodes.length) {
    updateElementChildNodes(newElement.childNodes, oldElement.childNodes);
    return true;
  }
  return true;
}

/**
 * @callback CreateApp
 * @param {object} props
 * @return {RenderAppElement}
 */

/**
 *
 * @param {CreateApp} createApp
 * @param {object} props
 * @param {HTMLDivElement} root
 */
export function render(createApp, props, root) {
  const newApp = createApp(props);
  if (root.childNodes.length) {
    updateElementChildNodes([newApp], root.childNodes);
  } else {
    root.appendChild(newApp);
  }
}
