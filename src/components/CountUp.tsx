"use client";

import { useState, useEffect, useRef } from "react";

export function CountUp({
  maxValue,
  duration,
}: {
  maxValue: number;
  duration: number;
}) {
  const [currentValue, setCurrentValue] = useState(maxValue);
  const ref = useRef<HTMLDivElement>(null);

  function startAnimationLoop() {
    let startTime: number;
    let inView = false;
    let running = true;

    function loop() {
      // console.log("loop", maxValue, inView, ref.current);

      if (!inView) {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          // console.log(rect.top, rect.bottom, window.innerHeight);
          if (rect.top < window.innerHeight && rect.bottom >= 0) {
            inView = true;
            startTime = +new Date();
          }
        }
      }

      if (inView) {
        const x = Math.min(1, (+new Date() - startTime) / duration);
        const value = Math.floor(x * maxValue);
        setCurrentValue(value);
      }

      if (running) {
        requestAnimationFrame(loop);
      }
    }

    requestAnimationFrame(loop);

    return () => {
      running = false;
    };
  }

  useEffect(() => {
    return startAnimationLoop();
  }, [ref]);

  return <div ref={ref}>{currentValue.toLocaleString("ro-RO")}</div>;
}
