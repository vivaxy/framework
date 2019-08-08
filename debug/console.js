/**
 * @since 2019-08-08 15:52
 * @author vivaxy
 */
const $log = document.createElement('div');
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
  $piece.textContent = args.join(' ');
  $log.appendChild($piece);
}
