/**
 * @since 2020-06-03 12:53
 * @author vivaxy
 */
export default function getCallSites() {
  const _prepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;
  const stack = /** @type {string[]} */ (
    /** @type {unknown} */ (new Error().stack)
  );
  Error.prepareStackTrace = _prepareStackTrace;
  stack.shift();
  return stack;
}
