import { useEffect, useState } from "react";
import type { DebugSettings } from "../types";

export type { DebugSettings };

export const useDebug = () => {
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [debugSettings, setDebugSettings] = useState<DebugSettings>({
    forceCardFailure: false,
    forceDispenseFailure: false,
    forceInvalidCash: false,
    forceStockMismatch: false,
  });

  const toggleDebugMode = () => {
    setIsDebugMode((prev) => !prev);
  };

  useEffect(() => {
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let index = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === konamiCode[index].toLowerCase()) {
        index++;
        if (index === konamiCode.length) {
          toggleDebugMode();
          index = 0;
        }
      } else {
        index = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return { isDebugMode, debugSettings, setDebugSettings };
};
