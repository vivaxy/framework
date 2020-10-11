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

function serializeMap(map) {
  const json = {};
  for (const key of map.keys()) {
    json[key] = map.get(key);
  }
  return JSON.stringify(json, null, 2);
}

function serializeArrayLike(arrayLike) {
  const array = Array.from(arrayLike);
  return `(${array.length}) [${array.map(serialize).join(', ')}]`;
}

function serializeDocument(htmlDocument) {
  const xmlSerializer = new XMLSerializer();
  return xmlSerializer.serializeToString(htmlDocument);
}

function serialize(arg) {
  if (arg instanceof Error) {
    if (!arg.stack) {
      // DOMException has no stack, captureStackTrace
      if (Error.captureStackTrace) {
        Error.captureStackTrace(arg);
      } else {
        arg.stack = '(Unavailable error stack)';
      }
    }
    return arg.stack;
  }
  if (arg instanceof File) {
    return `File ${serialize({
      type: arg.type,
      name: arg.name,
      size: arg.size,
      lastModified: arg.lastModified,
      lastModifiedDate: arg.lastModifiedDate,
      webkitRelativePath: arg.webkitRelativePath,
    })}`;
  }
  if (arg instanceof Map) {
    return `Map(${arg.size}) ${serializeMap(arg)}`;
  }
  if (arg instanceof Set) {
    return `Set${serializeArrayLike(arg)}`;
  }
  if (arg instanceof WeakMap || arg instanceof WeakSet) {
    return arg.toString();
  }
  if (arg instanceof Document) {
    return `#document(${serializeDocument(arg)})`;
  }
  if (arg instanceof Date) {
    return arg.toString();
  }
  if (typeof arg === 'boolean') {
    return String(arg);
  }
  if (typeof arg === 'number') {
    return String(arg);
  }
  if (typeof arg === 'symbol') {
    return arg.toString();
  }
  if (typeof arg === 'undefined' || arg === null) {
    return String(arg);
  }
  if (arg instanceof Array) {
    return serializeArrayLike(arg);
  }
  if (typeof arg === 'object') {
    if (arg.constructor.name === 'CallSite') {
      return `CallSite(${arg.toString()})`;
    }
    return JSON.stringify(
      arg,
      function(key, value) {
        if (!key) {
          return value;
        }
        return serialize(value);
      },
      2,
    );
  }
  if (typeof arg === 'function') {
    return String(arg);
  }
  return String(arg);
}

function getLogStyle(arg) {
  if (typeof arg === 'boolean') {
    return {
      color: '#0d22aa',
    };
  }
  if (typeof arg === 'number') {
    return {
      color: '#1c00cf',
    };
  }
  if (typeof arg === 'symbol') {
    return {
      color: '#c41a16',
    };
  }
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
    const styles = getLogStyle(arg);
    Object.keys(styles).forEach(function(key) {
      $arg.style[key] = styles[key];
    });
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
