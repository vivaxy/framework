/**
 * @since 2023-10-09
 * @author vivaxy
 * @related-project https://github.com/sindresorhus/slugify
 * @related-project https://github.com/sindresorhus/camelcase
 * @related-project https://github.com/sindresorhus/humanize-string
 * @see https://www.freecodecamp.org/news/snake-case-vs-camel-case-vs-pascal-case-vs-kebab-case-whats-the-difference/
 */

/**
 * snake_case
 * SNAKE_CASE
 * kebab-case
 * camelCase
 * PascalCase
 * Humanized string
 */
/**
 * fileName => FileName
 * @param name
 * @returns {String}
 */
export function camelCaseToPascalCase(name) {
  return name[0].toUpperCase() + name.slice(1);
}

/**
 * fileName => file-name
 * @param name
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
 * file-name => FileName
 * @param name
 * @returns {String}
 */
export function kebabCaseToPascalCase(name) {
  return name.replace(/(-|^)\w/g, function (found) {
    return found.slice(-1).toUpperCase();
  });
}

/**
 * file-name => fileName
 * @param name
 * @returns {String}
 */
export function kebabCaseToCamelCase(name) {
  return name.replace(/(-)w/g, function (found) {
    return found.slice(-1).toUpperCase();
  });
}

/**
 * FileName => file-name
 * @param name
 * @returns {String}
 */
export function pascalCaseToKebabCase(name) {
  return name.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * FileName => fileName
 * @param name
 * @returns {String}
 */
export function pascalCaseToCamelCase(name) {
  return name[0].toLowerCase() + name.slice(1);
}

// /**
//  * FileName => file-name
//  * @param name
//  * @returns {String}
//  */
// export function pascalCaseToKebabCase(name) {
//   return Array.prototype.map.call(name, function (letter, index) {
//     if (index === 0) {
//       return letter.toLowerCase();
//     } else if (letter.toLowerCase() !== letter) {
//       return '-' + letter.toLowerCase();
//     } else {
//       return letter;
//     }
//   }).join('');
// }
