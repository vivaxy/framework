function create$log() {
  const $log = document.createElement('div');
  $log.style.fontFamily = 'menlo, monospace';
  $log.style.fontSize = '12px';
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

  $clear.addEventListener('click', function() {
    console.clear();
  });

  return $clear;
}

function create$actionBar() {
  const $actionBar = document.createElement('div');
  $actionBar.style.backgroundColor = '#f3f3f3';
  const $actionButtons = [create$clear()];
  $actionButtons.forEach(function($actionButton) {
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

function serializeFile(file) {
  return `File ${serialize({
    type: file.type,
    name: file.name,
    size: file.size,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
    webkitRelativePath: file.webkitRelativePath,
  })}`;
}

function serializeMap(map) {
  const json = {};
  for (const key of map.keys()) {
    json[key] = map.get(key);
  }
  return `Map(${map.size}) ${JSON.stringify(json, null, 2)}`;
}

function serializeSet(set) {
  return `Set${serializeArray(set)}`;
}

function serializeWeakMap(weakMap) {
  return weakMap.toString();
}

function serializeWeakSet(weakSet) {
  return weakSet.toString();
}

function serializeDocument(document) {
  const xmlSerializer = new XMLSerializer();
  return `#document(${xmlSerializer.serializeToString(document)})`;
}

function serializeElement(element) {
  const $parent = document.createElement('div');
  $parent.appendChild(element);
  return $parent.innerHTML;
}

function serializeDate(date) {
  return date.toString();
}

function serializeArray(arrayLike) {
  const array = Array.from(arrayLike);
  return `(${array.length}) [${array.map(serialize).join(', ')}]`;
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
  return withStyles(symbol.toString(), {
    color: '#c41a16',
  });
}

function serializeNull(arg) {
  return String(arg);
}

function serializeNull(arg) {
  return String(arg);
}

function serializeCallSite(callSite) {
  return `CallSite(${callSite.toString()})`;
}

function serializeObject(object) {
  return JSON.stringify(
    object,
    function(key, value) {
      if (!key) {
        return value;
      }
      return serialize(value);
    },
    null,
  );
}

function serializeFunction(arg) {
  return String(arg);
}

function serialize(arg) {
  switch (true) {
    case arg instanceof Error:
      return serializeError(arg);
    case arg instanceof File:
      return serializeFile(arg);
    case arg instanceof Map:
      return serializeMap(arg);
    case arg instanceof Set:
      return serializeSet(arg);
    case arg instanceof WeakMap:
      return serializeWeakMap(arg);
    case arg instanceof WeakSet:
      return serializeWeakSet(arg);
    case arg instanceof Document:
      return serializeDocument(arg);
    case arg instanceof Element:
      return serializeElement(arg);
    case arg instanceof Date:
      return serializeDate(arg);
    case arg instanceof Array:
      return serializeArray(arg);
    case typeof arg === 'boolean':
      return serializeBoolean(arg);
    case typeof arg === 'number':
      return serializeNumber(arg);
    case typeof arg === 'symbol':
      return serializeSymbol(arg);
    case typeof arg === 'undefined':
      return serializeNull(arg);
    case arg === null:
      return serializeNull(arg);
    case typeof arg === 'object' && arg.constructor.name === 'CallSite':
      return serializeCallSite(arg);
    case typeof arg === 'object':
      return serializeObject(arg);
    case typeof arg === 'function':
      return serializeFunction(arg);
  }
  return String(arg);
}

function withStyles(innerHTML, styles) {
  const $span = document.createElement('span');
  $span.innerHTML = innerHTML;
  Object.keys(styles).forEach(function(key) {
    $span.style[key] = styles[key];
  });
  return serializeElement($span);
}

function getLogStyles(arg) {
  if (typeof arg === 'undefined' || arg === null) {
    return {
      color: '#808080',
    };
  }
  if (typeof arg === 'function') {
    return {
      fontStyle: 'italic',
    };
  }
  return {};
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
  args.forEach(function(arg) {
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

  const originalConsole = {
    clear: console.clear,
    time: console.time,
    timeLog: console.timeLog,
    timeEnd: console.timeEnd,
  };

  console.clear = function clear() {
    $log.innerHTML = '';
    originalConsole.clear();
  };

  const timers = {};
  console.time = function(timerName = 'default') {
    originalConsole.time(timerName);
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

  console.timeLog = function(timerName = 'default') {
    originalConsole.timeLog(timerName);
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

  console.timeEnd = function(timerName = 'default') {
    originalConsole.timeEnd(timerName);
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

  Object.keys(logTypeColors).forEach(function(type) {
    originalConsole[type] = console[type];

    const colors = logTypeColors[type];
    console[type] = function(...args) {
      appendLog($log, colors, ...args);
      originalConsole[type](...args);
    };
  });

  return function reset() {
    Object.keys(originalConsole).forEach(function(method) {
      console[method] = originalConsole[method];
    });

    document.currentScript.removeChild($main);
    window.removeEventListener(ERROR_EVENT, errorHandler);
  };
}
window.framework = window.framework || {};
window.framework.console = window.framework.console || {};
window.framework.console.init = window.framework.console.init || init;
init();
