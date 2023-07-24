"use client";

import { useEffect, useRef } from "react";

export function CountUp({
  maxValue,
  duration,
}: {
  maxValue: number;
  duration: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let startTime: number;
    let inView = false;
    let running = true;

    function loop() {
      if (ref.current) {
        if (!inView) {
          const rect = ref.current.getBoundingClientRect();

          if (rect.top < window.innerHeight && rect.bottom >= 0) {
            inView = true;
            startTime = +new Date();
          }
        }

        if (inView) {
          const x = Math.min(1, (+new Date() - startTime) / duration);
          const value = Math.floor(x * maxValue);
          ref.current.innerHTML = value.toLocaleString("ro-RO");
        }
      }

      if (running) {
        requestAnimationFrame(loop);
      }
    }

    requestAnimationFrame(loop);

    return () => {
      running = false;
    };
  }, [ref, duration, maxValue]);

  return <div ref={ref}>{maxValue}</div>;
}
