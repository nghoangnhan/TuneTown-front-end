import { useEffect, useState } from "react";

export default function useDebounce(initializeValue = "", delayy = 1000) {
  const [debounceValue, setDebounceValue] = useState(initializeValue);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(initializeValue);
    }, delayy);
    return () => {
      clearTimeout(timer);
    };
  }, [initializeValue, delayy]);
  return debounceValue;
}
