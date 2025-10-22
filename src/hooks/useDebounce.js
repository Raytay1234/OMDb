import { useState, useEffect } from "react";

/**
 * Returns a debounced value that updates only after the delay.
 * @param {any} value
 * @param {number} delay in milliseconds
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
