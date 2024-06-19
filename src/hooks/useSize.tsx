import useResizeObserver from "@react-hook/resize-observer";
import { useLayoutEffect, useState } from "react";

const useSize = (targetRef: any) => {
  const [size, setSize] = useState<DOMRect>();

  useLayoutEffect(() => {
    setSize(targetRef?.current?.getBoundingClientRect());
  }, [targetRef]);

  // Where the magic happens
  useResizeObserver(targetRef, (entry) => setSize(entry.contentRect));
  return size;
};
export default useSize;
