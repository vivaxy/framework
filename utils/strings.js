/**
 * @since 2023-10-09
 * @author vivaxy
 * @related-project https://github.com/sindresorhus/slugify
 * @related-project https://github.com/sindresorhus/camelcase
 * @related-project https://github.com/sindresorhus/humanize-string
 * @see https://www.freecodecamp.org/news/snake-case-vs-camel-case-vs-pascal-case-vs-kebab-case-whats-the-difference/
 */

/**
 * camelCase
 * kebab-case
 * snake_case
 * PascalCase
 * Title Case
 * Sentence case
 */

/**
 * fileName => file-name
 * @param {string} name
 * @returns {String}
 */
export function camelCaseToKebabCase(name) {
  return Array.prototype.map
    .call(name, function (letter) {
      if (letter.toLowerCase() !== letter) {
        return '-' + letter.toLowerCase();
      } else {
        return letter;
      }
    })
    .join('');
}

/**
 * fileName => file_name
 * @param {string} name
 * @returns {String}
 */
export function camelCaseToSnakeCase(name) {
  return Array.prototype.map
    .call(name, function (letter) {
      if (letter.toLowerCase() !== letter) {
        return '_' + letter.toLowerCase();
      } else {
        return letter;
      }
    })
    .join('');
}

/**
 * fileName => FileName
 * @param {string} name
 * @returns {String}
 */
export function camelCaseToPascalCase(name) {
  return name[0].toUpperCase() + name.slice(1);
}

/**
 * fileName => File Name
 * @param {string} name
 * @returns {String}
 */
export function camelCaseToTitleCase(name) {
  return Array.prototype.map
    .call(name, function (letter, index) {
      if (index === 0) {
        return letter.toUpperCase();
      }
      if (letter.toLowerCase() !== letter) {
        return ' ' + letter;
      } else {
        return letter;
      }
    })
    .join('');
}

/**
 * fileName => File name
 * @param {string} name
 * @returns {String}
 */
export function camelCaseToSentenceCase(name) {
  return Array.prototype.map
    .call(name, function (letter, index) {
      if (index === 0) {
        return letter.toUpperCase();
      }
      if (letter.toLowerCase() !== letter) {
        return ' ' + letter.toLowerCase();
      } else {
        return letter;
      }
    })
    .join('');
}

/**
 * file-name => fileName
 * @param {string} name
 * @returns {String}
 */
export function kebabCaseToCamelCase(name) {
  return name.replace(/-\w/g, function (found) {
    return found.slice(-1).toUpperCase();
  });
}

/**
 * file-name => FileName
 * @param {string} name
 * @returns {String}
 */
export function kebabCaseToPascalCase(name) {
  return name.replace(/(-|^)\w/g, function (found) {
    return found.slice(-1).toUpperCase();
  });
}

/**
 * file-name => File name
 * @param {string} name
 * @returns {String}
 */
export function kebabCaseToSentenceCase(name) {
  return name.replace(/(-|^)\w/g, function (found) {
    return found.replace('-', ' ').toUpperCase();
  });
}

/**
 * file_name => fileName
 * @param {string} name
 */
export function snakeCaseToCamelCase(name) {
  return name.replace(/_\w/g, function (found) {
    return found.slice(-1).toUpperCase();
  });
}

/**
 * FileName => fileName
 * @param {string} name
 * @returns {String}
 */
export function pascalCaseToCamelCase(name) {
  return name[0].toLowerCase() + name.slice(1);
}

/**
 * FileName => file-name
 * @param {string} name
 * @returns {String}
 */
export function pascalCaseToKebabCase(name) {
  return Array.prototype.map
    .call(name, function (letter, index) {
      if (index === 0) {
        return letter.toLowerCase();
      } else if (letter.toLowerCase() !== letter) {
        return '-' + letter.toLowerCase();
      } else {
        return letter;
      }
    })
    .join('');
}
