import { useEffect, useState } from "react";

// return a single setStateValue that reset the value to inital after X seconds
export const useFlash = (props?: { timeout?: number }) => {
  const timeout = props?.timeout || 3000;
  const [flash, setFlash] = useState(false);
  // eslint-disable-next-line no-undef
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setTimeoutId(
      setTimeout(() => {
        setFlash(false);
      }, timeout)
    );

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [flash]);
  return { flash, setFlash };
};

export const useFlashEffect = (value: any, props?: { timeout?: number }) => {
  const { setFlash, flash } = useFlash(props);
  useEffect(() => {
    setFlash(true);
  }, [value]);
  return flash;
};
