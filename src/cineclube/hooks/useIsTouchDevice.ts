"use client";

import { useEffect, useState } from "react";

/** Detecta dispositivos de toque (para desligar o cursor customizado etc.). */
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(true); // assume touch até provar o contrário (SSR-safe)

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  return isTouch;
}
