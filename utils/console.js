const logBorderColor = '#f0f0f0';

const quote = "'";

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
  log: ['#303942', '#fff', logBorderColor],
  debug: ['#303942', '#fff', logBorderColor],
  info: ['#303942', '#fff', logBorderColor],
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
    return withStringStyle(`${quote}${serialize(value, met)}${quote}`);
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
          `${quote}${key}${quote}`,
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

function serializeElementAttributes(element) {
  element.getAttributeNames().map((key) => {
    return `${withStyles(key, { color: 'rgb(153, 69, 0)' })}`;
  });
}

function serializeElement(element) {
  return withStyles(escapeHTML(`<${element.localName}>`), {
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
        if (typeof item === 'string') {
          return withStringStyle(`${quote}${serialize(item, met)}${quote}`);
        }
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

function serializeObjectLike(objectLike) {
  return serializeObject(JSON.parse(JSON.stringify(objectLike)));
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
      return escapeHTML(serializeError(arg));
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
    case arg instanceof DOMRect:
    case arg instanceof DOMRectList:
      return serializeObjectLike(arg);
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
    assert: console.assert,
    table: console.table,
  };

  console.clear = function clear() {
    $log.innerHTML = '';
    nativeConsole.clear();
  };

  console.assert = function assert(assertion, ...messages) {
    nativeConsole.assert(assertion, ...messages);
    if (!assertion) {
      appendLog($log, logTypeColors.error, 'Assertion failed:', ...messages);
    }
  };

  console.table = function table(data, columns) {
    nativeConsole.table(data, columns);

    function addLeftBorder($td) {
      $td.style.borderWidth = '0';
      $td.style.borderColor = borderColor;
      $td.style.borderStyle = 'solid';
      $td.style.borderLeftWidth = '1px';
      $td.style.borderRightWidth = '1px';
    }

    function addTableHeaderStyle($th) {
      $th.style.textAlign = 'left';
      $th.style.fontWeight = 'normal';
    }

    function addTableCellStyle($cell) {
      $cell.style.paddingLeft = '4px';
    }

    function createTableRow(item) {
      const tableRow = [];
      if (Array.isArray(item)) {
        item.forEach(function (value, i) {
          tableHeaders[i] = String(i);
          tableRow.push(value);
        });
      } else if (typeof item === 'object') {
        Object.keys(item).forEach(function (k) {
          if (!tableHeaders.includes(k)) {
            tableHeaders.push(k);
          }
          const index = tableHeaders.indexOf(k);
          tableRow[index] = item[k];
        });
      } else {
        tableHeaders[0] = 'value';
        tableRow.push(item);
      }
      return tableRow;
    }

    const tableHeaders = [];
    const tableData = [];
    let maxColsCount = 0;
    if (Array.isArray(data)) {
      data.forEach(function (item, index) {
        const tableRow = [String(index), ...createTableRow(item, index)];
        tableData.push(tableRow);
        maxColsCount = Math.max(maxColsCount, tableRow.length);
      });
    } else {
      Object.keys(data).forEach(function (key) {
        const tableRow = [key, ...createTableRow(data[key])];
        tableData.push(tableRow);
        maxColsCount = Math.max(maxColsCount, tableRow.length);
      });
    }
    const borderColor = 'rgb(223, 225, 227)';
    const backgroundColor = 'rgb(241, 243, 244)';
    const $table = document.createElement('table');
    $table.style.boxSizing = 'border-box';
    $table.style.borderCollapse = 'collapse';
    $table.style.width = '100%';
    $table.style.border = `1px solid ${borderColor}`;
    const $thead = document.createElement('thead');
    const $theadRow = document.createElement('tr');
    $theadRow.style.borderWidth = '0';
    $theadRow.style.borderColor = borderColor;
    $theadRow.style.borderBottomWidth = '1px';
    $theadRow.style.borderStyle = 'solid';
    $theadRow.style.backgroundColor = backgroundColor;
    const $indexHeader = document.createElement('th');
    addTableHeaderStyle($indexHeader);
    addTableCellStyle($indexHeader);
    $indexHeader.textContent = '(index)';
    $theadRow.appendChild($indexHeader);
    tableHeaders.forEach(function (col) {
      if (!columns || columns.includes(col)) {
        const $th = document.createElement('th');
        addTableHeaderStyle($th);
        addTableCellStyle($th);
        $th.textContent = col;
        addLeftBorder($th);
        $theadRow.appendChild($th);
      }
    });
    $thead.appendChild($theadRow);

    const $tbody = document.createElement('tbody');
    tableData.forEach(function (rowData, index) {
      const $tr = document.createElement('tr');
      if (index % 2 === 1) {
        $tr.style.backgroundColor = backgroundColor;
      }
      for (let i = 0; i < maxColsCount; i++) {
        if (i === 0 || !columns || columns.includes(tableHeaders[i - 1])) {
          // filter columns
          const $td = document.createElement('td');
          if (i < rowData.length) {
            if (i === 0) {
              $td.innerHTML = serialize(rowData[i]);
            } else {
              $td.innerHTML = serializeObjectValue(rowData[i]);
            }
          }
          addLeftBorder($td);
          addTableCellStyle($td);
          $tr.appendChild($td);
        }
      }
      $tbody.appendChild($tr);
    });

    $table.appendChild($thead);
    $table.appendChild($tbody);
    const $pieceContainer = document.createElement('div');
    $pieceContainer.style.padding = '8px';
    $pieceContainer.style.borderBottom = `1px solid ${logBorderColor}`;
    $pieceContainer.appendChild($table);
    $log.appendChild($pieceContainer);
  };

  const timers = {};
  console.time = function time(timerName = 'default') {
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

  console.timeLog = function timeLog(timerName = 'default') {
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

  console.timeEnd = function timeEnd(timerName = 'default') {
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
      nativeConsole[type](...args);
      appendLog($log, colors, ...args);
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
