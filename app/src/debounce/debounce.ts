import { DebounceOptions } from "./debounce-options";

/**
 * Debounce an callback function.
 *
 * @param {Callback} callback The callback function to be debounced.
 * @param {Object} [options={}] The options object.
 * @param {number} [options.delay] The delay in milliseconds before invoking the callback.
 * @param {boolean} [options.leading=false] The callback function should be invoked on the leading edge.
 * @param {boolean} [options.trailing=true] The callback function should be invoked on the trailing edge.
 *
 * @returns {(...args: Arguments) => () => void} A function to trigger the debounced callback.
 */
export function debounce<
  Destructor extends (() => void) | void,
  Arguments extends ReadonlyArray<any>,
  Callback extends (...args: Arguments) => Destructor
>(callback: Callback, options: DebounceOptions = {}) {
  const { delay = 0, leading = false, trailing = true } = options;

  if (!delay) return callback;

  let timeout: NodeJS.Timeout | null = null;
  let destructor: Destructor;

  const debounced = (...args: Arguments) => {
    if (timeout) clearTimeout(timeout);
    else if (leading) destructor = callback(...args);

    timeout = setTimeout(() => {
      if (trailing) destructor = callback(...args);
      timeout = null;
    }, delay);

    return (): void => {
      if (timeout) clearTimeout(timeout);
      if (destructor) destructor();
    };
  };

  return debounced;
}
