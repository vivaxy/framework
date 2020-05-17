const $log = document.createElement('div');
$log.style.fontFamily = 'menlo, monospace';
$log.style.fontSize = '12px';
$log.style.lineHeight = '16px';
$log.style.minWidth = '100%';

const $actionBar = document.createElement('div');
$actionBar.style.backgroundColor = '#f3f3f3';
const $actionButtons = [createClearButton()];
$actionButtons.forEach(function($actionButton) {
  $actionBar.appendChild($actionButton);
});

function createClearButton() {
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

const $main = document.createElement('div');
$main.style.border = '1px solid rgb(170, 170, 170)';
$main.style.overflow = 'auto';
$main.style.fontSize = '0';
$main.appendChild($actionBar);
$main.appendChild($log);
document.currentScript.insertAdjacentElement('afterend', $main);

const logTypeColors = {
  log: ['#303942', '#fff', '#f0f0f0'],
  debug: ['#303942', '#fff', '#f0f0f0'],
  info: ['#303942', '#fff', '#f0f0f0'],
  warn: ['#5c3c00', '#fffbe5', '#fff5c2'],
  error: ['#f00', '#fff0f0', '#ffd6d6'],
};

const originalConsole = {
  clear: console.clear,
  time: console.time,
  timeLog: console.timeLog,
  timeEnd: console.timeEnd,
};

console.clear = function() {
  $log.innerHTML = '';
  originalConsole.clear();
};

const timers = {};
console.time = function(timerName = 'default') {
  originalConsole.time(timerName);
  if (timerName in timers) {
    appendLog(logTypeColors.warn, `Timer '${timerName}' already exists`);
  } else {
    timers[timerName] = performance.now();
  }
};

console.timeLog = function(timerName = 'default') {
  originalConsole.timeLog(timerName);
  if (timerName in timers) {
    appendLog(
      logTypeColors.log,
      `${timerName}: ${performance.now() - timers[timerName]}ms`,
    );
  } else {
    appendLog(logTypeColors.warn, `Timer '${timerName}' does not exist`);
  }
};

console.timeEnd = function(timerName = 'default') {
  originalConsole.timeEnd(timerName);
  if (timerName in timers) {
    appendLog(
      logTypeColors.log,
      `${timerName}: ${performance.now() - timers[timerName]}ms`,
    );
    delete timers[timerName];
  } else {
    appendLog(logTypeColors.warn, `Timer '${timerName}' does not exist`);
  }
};

Object.keys(logTypeColors).forEach(function(type) {
  const colors = logTypeColors[type];

  originalConsole[type] = console[type];
  console[type] = function(...args) {
    appendLog(colors, ...args);
    originalConsole[type](...args);
  };
});

function serializeMap(map) {
  const json = {};
  for (const key of map.keys()) {
    json[key] = map.get(key);
  }
  return JSON.stringify(json, null, 2);
}

function serializeSet(set) {
  return `[${Array.from(set)
    .map((item) => JSON.stringify(item))
    .join(', ')}]`;
}

function serializeDocument(htmlDocument) {
  const xmlSerializer = new XMLSerializer();
  return xmlSerializer.serializeToString(htmlDocument);
}

function appendLog([color, backgroundColor, borderBottomColor], ...args) {
  const $piece = document.createElement('div');
  $piece.style.whiteSpace = 'pre-wrap';
  $piece.style.wordBreak = 'break-all';
  $piece.style.margin = '1px 8px';
  args.forEach(function(arg) {
    const $arg = document.createElement('span');
    if (arg instanceof Error) {
      if (!arg.stack) {
        // DOMException has no stack, captureStackTrace
        if (Error.captureStackTrace) {
          Error.captureStackTrace(arg);
        } else {
          arg.stack = '(Unavailable error stack)';
        }
      }
      $arg.innerText = arg.stack;
    } else if (arg instanceof Map) {
      $arg.innerText = `Map(${arg.size}) ${serializeMap(arg)}`;
    } else if (arg instanceof Set) {
      $arg.innerText = `Set(${arg.size}) ${serializeSet(arg)}`;
    } else if (arg instanceof WeakMap || arg instanceof WeakSet) {
      $arg.innerText = arg.toString();
    } else if (arg instanceof Document) {
      $arg.innerText = `#document(${serializeDocument(arg)})`;
    } else if (typeof arg === 'boolean') {
      $arg.style.color = '#0d22aa';
      $arg.innerText = arg;
    } else if (typeof arg === 'number') {
      $arg.style.color = '#1c00cf';
      $arg.innerText = arg;
    } else if (typeof arg === 'symbol') {
      $arg.style.color = '#c41a16';
      $arg.innerText = arg.toString();
    } else if (typeof arg === 'undefined' || arg === null) {
      $arg.style.color = '#808080';
      $arg.innerHTML = String(arg);
    } else if (typeof arg === 'object') {
      $arg.innerHTML = JSON.stringify(arg, null, 2);
    } else if (typeof arg === 'function') {
      $arg.style.fontStyle = 'italic';
      $arg.innerHTML = arg;
    } else {
      $arg.innerText = arg;
    }
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
  $log.appendChild($pieceContainer);
}
