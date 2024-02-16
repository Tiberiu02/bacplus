"use client";

import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

export function VerticalTrack({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;

    if (!container) return;

    let stop = false;
    let time = Date.now();
    let scroll = 0;

    const loop = () => {
      if (stop) return;

      const dt = Math.min(100, Date.now() - time); // cap delta time to prevent large jumps when tab is inactive
      scroll += dt / 50;
      time = Date.now();

      const [firstChild, secondChild] = container.children;

      if (firstChild && secondChild) {
        const widthFirstChild =
          secondChild.getBoundingClientRect().left -
          firstChild.getBoundingClientRect().left;

        if (scroll > widthFirstChild) {
          scroll -= widthFirstChild;
          container.appendChild(firstChild);
        }
      }

      for (const child of container.children) {
        if (!(child instanceof HTMLElement)) continue;
        child.style.transform = `translateX(-${scroll}px)`;
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    return () => {
      stop = true;
    };
  }, [ref]);

  return (
    <div
      className={twMerge("flex w-full overflow-hidden", className)}
      ref={ref}
    >
      {children}
    </div>
  );
}
