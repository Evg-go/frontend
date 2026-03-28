import { useEffect, useState } from 'react';

export function use_debounce<T>(value: T, delay_ms = 350): T {
  const [debounced_value, set_debounced_value] = useState<T>(value);

  useEffect(() => {
    const timeout_id = window.setTimeout(() => {
      set_debounced_value(value);
    }, delay_ms);

    return () => {
      window.clearTimeout(timeout_id);
    };
  }, [delay_ms, value]);

  return debounced_value;
}