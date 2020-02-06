const $log = document.createElement('div');
$log.style.fontFamily = 'menlo, monospace';
$log.style.fontSize = '12px';
$log.style.lineHeight = '16px';
$log.style.display = 'inline-block';

const $logContainer = document.createElement('div');
$logContainer.style.border = '1px solid rgb(170, 170, 170)';
$logContainer.style.overflow = 'auto';
$logContainer.appendChild($log);
document.currentScript.insertAdjacentElement('afterend', $logContainer);

const logTypeColors = {
  log: ['#303942', '#fff', '#f0f0f0'],
  debug: ['#303942', '#fff', '#f0f0f0'],
  info: ['#303942', '#fff', '#f0f0f0'],
  warn: ['#5c3c00', '#fffbe5', '#fff5c2'],
  error: ['#f00', '#fff0f0', '#ffd6d6'],
};

const originalConsole = {
  clear: console.clear,
};

console.clear = function() {
  $log.innerHTML = '';
  originalConsole.clear();
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

function appendLog([color, backgroundColor, borderBottomColor], ...args) {
  const $piece = document.createElement('div');
  $piece.style.whiteSpace = 'pre';
  $piece.style.margin = '1px 8px';
  $piece.style.display = 'inline-block';
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
