import { useEffect, useRef } from "react";

/** Use a value from the previous render */
function usePrev<T>(value: T): T | undefined {
  const prevRef = useRef<any>(undefined);
  useEffect(() => {
    prevRef.current = value;
  });
  return prevRef.current;
}
export default usePrev;
