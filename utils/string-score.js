/**
 * @since 2024-03-11
 * @author vivaxy
 * @ref https://github.com/joshaven/string_score
 */
/**
 * @param {string} target
 * @param {string} input
 * @returns {{ weight: number, matched: null|RegExpMatchArray }}
 */
export function stringScore(target, input) {
  const regExpString = `(.*?)${input
    .split('')
    // 中文输入时，内容是 a’b'c
    .filter((x) => x !== "'")
    .map((x) => x.replace(/([()[{*+.$^\\|?])/g, '\\$1'))
    .join('(.*?)')}(.*)`;

  const matched = target.match(new RegExp(regExpString));
  let weight = 0;
  let maxSequence = 0;
  let currentSequence = 0;
  if (matched) {
    // ['', ''] > ['', 'x'] > ['', 'xx'] > ['x', ''] > ['x', 'x'] > ['x', 'xx']
    // > ['xx', '']
    matched.slice(1).forEach(function (part, index, array) {
      weight += (10 - part.length) ** (array.length - index);
      if (part === '') {
        currentSequence++;
      } else {
        maxSequence = Math.max(maxSequence, currentSequence);
        currentSequence = 0;
      }
    });
    maxSequence = Math.max(maxSequence, currentSequence);
    weight += 10 ** matched.length * maxSequence;
  }
  return {
    weight,
    matched,
  };
}
