/**
 * @since 2023-11-30
 * @author vivaxy
 */

/**
 * @typedef RenderAppElement
 * @type {HTMLElement | Text}
 */
/**
 * @param {undefined|boolean|AddEventListenerOptions} options
 * @return {{once: boolean, capture: boolean, passive: boolean, signal:
 *   null}|{capture: boolean}}
 */
function formatEventListenerOptions(options = {}) {
  if (typeof options === 'boolean') {
    return {
      capture: options,
      once: false,
      passive: false,
      signal: undefined,
    };
  }
  return {
    capture: !!options.capture,
    once: !!options.once,
    passive: !!options.passive,
    signal: options.signal,
  };
}

function isSameEventListener(eventA, eventB) {
  return (
    eventA.listener === eventB.listener &&
    isSameEventListenerOptions(eventA.options, eventB.options)
  );
}

function isSameEventListenerOptions(optionA, optionB) {
  return (
    optionA.capture === optionB.capture &&
    optionA.once === optionB.once &&
    optionA.passive === optionB.passive &&
    optionA.signal === optionB.signal
  );
}

/**
 *
 * @param {string} tagName
 */
function createElementWithNS(tagName) {
  if (['svg'].includes(tagName)) {
    return document.createElementNS('http://www.w3.org/2000/svg', tagName);
  }
  return document.createElement(tagName);
}

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
  const element = createElementWithNS(tagName);
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
  element.__events = {};
  element.addEventListener = function addEventListener(
    type,
    listener,
    options,
  ) {
    element.__events[type] = element.__events[type] || [];
    if (typeof options === 'boolean') {
    }
    element.__events[type].push({
      listener,
      options: formatEventListenerOptions(options),
    });
    Element.prototype.addEventListener.call(element, type, listener, options);
  };
  element.removeEventListener = function removeEventListener(
    type,
    listener,
    options,
  ) {
    Element.prototype.removeEventListener.call(
      element,
      type,
      listener,
      options,
    );
    const index = (element.__events[type] || []).findIndex(function (saved) {
      return isSameEventListener({ listener, options }, saved);
    });
    if (index !== -1) {
      element.__events[type].splice(index, 1);
    }
  };
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
  // may use old events with old elements, expect to use new events
  for (const eventType of Object.keys(oldElement.__events || {})) {
    const oldElementEvents = oldElement.__events[eventType] || [];
    const newElementEvents = newElement.__events[eventType] || [];
    newElementEvents.forEach(function (newEvent) {
      const oldEvent = oldElementEvents.find(function (oldEvent) {
        return isSameEventListener(oldEvent, newEvent);
      });
      if (!oldEvent) {
        // should add event listener
        oldElement.addEventListener(
          eventType,
          newEvent.listener,
          newEvent.options,
        );
      }
    });
    oldElementEvents.forEach(function (oldEvent) {
      const newEvent = newElementEvents.find(function (newEvent) {
        return isSameEventListener(oldEvent, newEvent);
      });
      if (!newEvent) {
        // should remove event listener
        oldElement.removeEventListener(
          eventType,
          oldEvent.listener,
          oldEvent.options,
        );
      }
    });
  }
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
