function escapeHTML(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function create$log() {
  const $log = document.createElement('div');
  $log.style.fontFamily = 'menlo, monospace';
  $log.style.fontSize = '11px';
  $log.style.lineHeight = '16px';
  $log.style.minWidth = '100%';
  return $log;
}

function create$clear() {
  const $clear = document.createElement('div');
  $clear.style.width = '24px';
  $clear.style.height = '24px';
  $clear.style.position = 'relative';

  const $circle = document.createElement('div');
  $circle.style.width = '10px';
  $circle.style.height = '10px';
  $circle.style.border = '2px solid #6e6e6e';
  $circle.style.borderRadius = '100%';
  center($circle);

  const $line = document.createElement('div');
  $line.style.backgroundColor = '#6e6e6e';
  $line.style.width = '10px';
  $line.style.height = '2px';
  $line.style.transform = 'rotate(45deg)';
  $line.style.transformOrigin = '0px 0px';
  center($line);

  function center($item) {
    $item.style.position = 'absolute';
    $item.style.top = '50%';
    $item.style.left = '50%';
    $item.style.transform += 'translate(-50%, -50%)';
  }

  $clear.appendChild($line);
  $clear.appendChild($circle);

  $clear.addEventListener('click', function () {
    console.clear();
  });

  return $clear;
}

function create$actionBar() {
  const $actionBar = document.createElement('div');
  $actionBar.style.backgroundColor = '#f3f3f3';
  const $actionButtons = [create$clear()];
  $actionButtons.forEach(function ($actionButton) {
    $actionBar.appendChild($actionButton);
  });
  return $actionBar;
}

function create$main() {
  const $main = document.createElement('div');
  $main.style.border = '1px solid rgb(170, 170, 170)';
  $main.style.overflow = 'auto';
  $main.style.fontSize = '0';
  return $main;
}

const logTypeColors = {
  log: ['#303942', '#fff', '#f0f0f0'],
  debug: ['#303942', '#fff', '#f0f0f0'],
  info: ['#303942', '#fff', '#f0f0f0'],
  warn: ['#5c3c00', '#fffbe5', '#fff5c2'],
  error: ['#f00', '#fff0f0', '#ffd6d6'],
};

function elementToString(element) {
  const $parent = document.createElement('div');
  $parent.appendChild(element);
  return $parent.innerHTML;
}

function serializeObjectValue(value, met) {
  if (typeof value === 'string') {
    return withStringStyle(`"${serialize(value, met)}"`);
  }
  return serialize(value, met);
}

function serializeSelection(selection, met) {
  const {
    type,
    isCollapsed,
    rangeCount,

    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset,
  } = selection;
  return serialize(
    {
      type,
      isCollapsed,
      rangeCount,

      anchorNode,
      anchorOffset,
      focusNode,
      focusOffset,
    },
    met,
  );
}

function serializeRange(range, met) {
  const {
    collapsed,
    commonAncestorContainer,
    startContainer,
    startOffset,
    endContainer,
    endOffset,
  } = range;
  return serialize(
    {
      collapsed,
      commonAncestorContainer,
      startContainer,
      startOffset,
      endContainer,
      endOffset,
    },
    met,
  );
}

function serializeErrorEvent(errorEvent, met) {
  return serialize(
    {
      message: errorEvent.message,
      error: errorEvent.error,
    },
    met,
  );
}

function serializeError(error) {
  if (!error.stack) {
    // DOMException has no stack, captureStackTrace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error);
    } else {
      error.stack = '(Unavailable error stack)';
    }
  }
  return error.stack;
}

function serializeFile(file, met) {
  return `${withItalicStyle('File ')}${serialize(
    {
      type: file.type,
      name: file.name,
      size: file.size,
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      webkitRelativePath: file.webkitRelativePath,
    },
    met,
  )}`;
}

function serializeMap(map, met) {
  return withItalicStyle(
    `Map(${map.size}) { ${Array.from(map.keys())
      .map(function (key) {
        return `${withStringStyle(
          `"${key}"`,
        )} => ${serializeObjectValue(map.get(key), met)}`;
      })
      .join(', ')} }`,
  );
}

function serializeSet(set, met) {
  const array = Array.from(set);
  return withItalicStyle(
    `Set(${array.length}) { ${array
      .map(function (item) {
        return serializeObjectValue(item, met);
      })
      .join(', ')} }`,
  );
}

function serializeWeakMap() {
  return withItalicStyle(`WeakMap {…}`);
}

function serializeWeakSet() {
  return withItalicStyle(`WeakSet {…}`);
}

function encodeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

function serializeDocument() {
  // const xmlSerializer = new XMLSerializer();
  // return `#document ${encodeHTML(xmlSerializer.serializeToString(document))}`;
  return `#document`;
}

function serializeText() {
  return withStyles('text', {
    color: 'rgb(136, 18, 128)',
  });
}

function serializeElement(element) {
  // const $parent = document.createElement('div');
  // $parent.appendChild(element.cloneNode(true));
  // return withStyles(encodeHTML($parent.innerHTML), {
  //   color: 'rgb(136, 18, 128)',
  // });
  return withStyles(element.localName, {
    color: 'rgb(126, 18, 128)',
  });
}

function serializeDate(date) {
  return date.toString();
}

function serializeArray(arrayLike, met) {
  const array = Array.from(arrayLike);
  return withItalicStyle(
    `(${array.length}) [${array
      .map(function (item) {
        return serialize(item, met);
      })
      .join(', ')}]`,
  );
}

function serializeBoolean(boolean) {
  return withStyles(String(boolean), {
    color: '#0d22aa',
  });
}

function serializeNumber(number) {
  return withStyles(String(number), {
    color: '#1c00cf',
  });
}

function serializeSymbol(symbol) {
  return withStringStyle(symbol.toString());
}

function serializeUndefined(arg) {
  return withStyles(String(arg), {
    color: '#808080',
  });
}

function serializeNull(arg) {
  return withStyles(String(arg), {
    color: '#808080',
  });
}

function serializeCallSite(callSite) {
  return `CallSite(${callSite.toString()})`;
}

function serializeObject(object, met = new Set()) {
  if (met.has(object)) {
    return '[...circular structure]';
  }
  met.add(object);
  return withItalicStyle(
    `{ ${Object.keys(object)
      .map(function (key) {
        return `${key}: ${serializeObjectValue(object[key], met)}`;
      })
      .join(', ')} }`,
  );
}

function serializeFunction(arg) {
  return withItalicStyle(String(arg));
}

function serialize(arg, met) {
  switch (true) {
    // ===
    case arg === null:
      return serializeNull(arg);
    // instanceof
    case arg instanceof Selection:
      return serializeSelection(arg, met);
    case arg instanceof Range:
      return serializeRange(arg, met);
    case arg instanceof ErrorEvent:
      return serializeErrorEvent(arg, met);
    case arg instanceof Error:
      return serializeError(arg);
    case arg instanceof File:
      return serializeFile(arg, met);
    case arg instanceof Map:
      return serializeMap(arg, met);
    case arg instanceof Set:
      return serializeSet(arg, met);
    case arg instanceof WeakMap:
      return serializeWeakMap(arg);
    case arg instanceof WeakSet:
      return serializeWeakSet(arg);
    case arg instanceof Document:
      return serializeDocument(arg);
    case arg instanceof Text:
      return serializeText(arg);
    case arg instanceof Element:
      return serializeElement(arg);
    case arg instanceof Date:
      return serializeDate(arg);
    case arg instanceof Array:
      return serializeArray(arg, met);
    // typeof
    case typeof arg === 'boolean':
      return serializeBoolean(arg);
    case typeof arg === 'number':
      return serializeNumber(arg);
    case typeof arg === 'symbol':
      return serializeSymbol(arg);
    case typeof arg === 'undefined':
      return serializeUndefined(arg);
    case typeof arg === 'object' &&
      arg.constructor &&
      arg.constructor.name === 'CallSite':
      return serializeCallSite(arg);
    case typeof arg === 'object':
      return serializeObject(arg, met);
    case typeof arg === 'function':
      return serializeFunction(arg);
    case typeof arg === 'string':
      return escapeHTML(arg);
  }
  throw new Error('Unexpected type');
}

function withStyles(innerHTML, styles) {
  const $span = document.createElement('span');
  $span.innerHTML = innerHTML;
  Object.keys(styles).forEach(function (key) {
    $span.style[key] = styles[key];
  });
  return elementToString($span);
}

function withItalicStyle(innerHTML) {
  return withStyles(innerHTML, {
    fontStyle: 'italic',
  });
}

function withStringStyle(innerHTML) {
  return withStyles(innerHTML, {
    color: '#c41a16',
  });
}

function appendLog(
  $parent,
  [color, backgroundColor, borderBottomColor],
  ...args
) {
  const $piece = document.createElement('div');
  $piece.style.whiteSpace = 'pre-wrap';
  $piece.style.wordBreak = 'break-all';
  $piece.style.margin = '1px 8px';
  args.forEach(function (arg) {
    const $arg = document.createElement('span');

    $arg.innerHTML = serialize(arg);
    $piece.appendChild($arg);

    const $space = document.createElement('span');
    $space.innerText = ' ';
    $piece.appendChild($space);
  });

  const $pieceContainer = document.createElement('div');
  $pieceContainer.style.backgroundColor = backgroundColor;
  $pieceContainer.style.color = color;
  $pieceContainer.style.borderBottom = `1px solid ${borderBottomColor}`;
  $pieceContainer.appendChild($piece);
  $parent.appendChild($pieceContainer);
}

function init() {
  const $actionBar = create$actionBar();
  const $log = create$log();
  const $main = create$main();
  $main.appendChild($actionBar);
  $main.appendChild($log);
  document.currentScript.insertAdjacentElement('afterend', $main);
  const ERROR_EVENT = 'error';

  function errorHandler(e) {
    console.error(e.error);
    e.preventDefault();
  }

  window.addEventListener(ERROR_EVENT, errorHandler);

  const nativeConsole = {
    clear: console.clear,
    time: console.time,
    timeLog: console.timeLog,
    timeEnd: console.timeEnd,
  };

  console.clear = function clear() {
    $log.innerHTML = '';
    nativeConsole.clear();
  };

  const timers = {};
  console.time = function (timerName = 'default') {
    nativeConsole.time(timerName);
    if (timerName in timers) {
      appendLog(
        $log,
        logTypeColors.warn,
        `Timer '${timerName}' already exists`,
      );
    } else {
      timers[timerName] = performance.now();
    }
  };

  console.timeLog = function (timerName = 'default') {
    nativeConsole.timeLog(timerName);
    if (timerName in timers) {
      appendLog(
        $log,
        logTypeColors.log,
        `${timerName}: ${performance.now() - timers[timerName]}ms`,
      );
    } else {
      appendLog(
        $log,
        logTypeColors.warn,
        `Timer '${timerName}' does not exist`,
      );
    }
  };

  console.timeEnd = function (timerName = 'default') {
    nativeConsole.timeEnd(timerName);
    if (timerName in timers) {
      appendLog(
        $log,
        logTypeColors.log,
        `${timerName}: ${performance.now() - timers[timerName]}ms`,
      );
      delete timers[timerName];
    } else {
      appendLog(
        $log,
        logTypeColors.warn,
        `Timer '${timerName}' does not exist`,
      );
    }
  };

  Object.keys(logTypeColors).forEach(function (type) {
    nativeConsole[type] = console[type];

    const colors = logTypeColors[type];
    console[type] = function (...args) {
      appendLog($log, colors, ...args);
      nativeConsole[type](...args);
    };
  });

  console.nativeConsole = nativeConsole;

  return function reset() {
    Object.keys(nativeConsole).forEach(function (method) {
      console[method] = nativeConsole[method];
    });

    document.currentScript.removeChild($main);
    window.removeEventListener(ERROR_EVENT, errorHandler);
  };
}

window.framework = window.framework || {};
window.framework.console = window.framework.console || {};
window.framework.console.init = window.framework.console.init || init;
init();
