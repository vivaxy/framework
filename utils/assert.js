/**
 * @since 2019-03-25 19:42
 * @author vivaxy
 */

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

export default assert;
