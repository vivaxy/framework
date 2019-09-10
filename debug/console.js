const $log = document.createElement('div');
$log.style.fontFamily = 'monospace';
$log.style.border = '1px solid rgb(170, 170, 170)';
$log.style.overflow = 'auto';
document.currentScript.insertAdjacentElement('afterend', $log);

const logTypeColors = {
  log: '#333',
  debug: '#33f',
  info: '#333',
  warn: '#ff3',
  error: '#f33',
};

const originalConsole = {
  clear: console.clear,
};

console.clear = function() {
  $log.innerHTML = '';
  originalConsole.clear();
};

Object.keys(logTypeColors).forEach(function(type) {
  const color = logTypeColors[type];

  originalConsole[type] = console[type];
  console[type] = function(...args) {
    appendLog(color, ...args);
    originalConsole[type](...args);
  };
});

function appendLog(color, ...args) {
  const $piece = document.createElement('div');
  $piece.style.color = color;
  $piece.style.whiteSpace = 'pre';
  $piece.style.margin = '1px 8px';
  $piece.style.display = 'inline-block';
  args.forEach(function(arg) {
    const $arg = document.createElement('span');
    if (arg instanceof Error) {
      $arg.innerText = arg.stack || arg.valueOf() || arg.name;
    } else if (typeof arg === 'boolean') {
      $arg.style.color = '#263baf';
      $arg.innerText = arg;
    } else if (typeof arg === 'number') {
      $arg.style.color = '#263baf';
      $arg.innerText = arg;
    } else if (typeof arg === 'symbol') {
      $arg.style.color = '#c21d1f';
      $arg.innerText = arg.toString();
    } else {
      $arg.innerText = arg;
    }
    $piece.appendChild($arg);

    const $space = document.createElement('span');
    $space.innerText = ' ';
    $piece.appendChild($space);
  });
  $log.appendChild($piece);

  const $br = document.createElement('div');
  $log.appendChild($br);
}
