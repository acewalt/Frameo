import React, { useCallback, useEffect, useRef, useState } from "react";

interface PlayheadProps {
  position: number;
  pixelsPerSecond: number;
  scrollX: number;
  onSeek: (time: number) => void;
  onScrubStart?: () => void;
  onScrubEnd?: () => void;
}

export const Playhead: React.FC<PlayheadProps> = ({
  position,
  pixelsPerSecond,
  scrollX,
  onSeek,
  onScrubStart,
  onScrubEnd,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const activePointerIdRef = useRef<number | null>(null);
  const pixelPosition = position * pixelsPerSecond - scrollX;

  const seekFromClientX = useCallback(
    (clientX: number) => {
      const parent = rootRef.current?.parentElement;
      if (!parent || pixelsPerSecond <= 0) return;
      const rect = parent.getBoundingClientRect();
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const headerOffset = mobile ? 80 : 128;
      const x = clientX - rect.left - headerOffset + scrollX;
      onSeek(Math.max(0, x / pixelsPerSecond));
    },
    [onSeek, pixelsPerSecond, scrollX],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      activePointerIdRef.current = e.pointerId;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Pointer capture is best-effort; window listeners below are the fallback.
      }
      setIsDragging(true);
      onScrubStart?.();
      seekFromClientX(e.clientX);
    },
    [onScrubStart, seekFromClientX],
  );

  useEffect(() => {
    if (!isDragging) return;

    let rafId: number | null = null;
    let latestX: number | null = null;

    const flush = () => {
      rafId = null;
      if (latestX !== null) seekFromClientX(latestX);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (
        activePointerIdRef.current !== null &&
        e.pointerId !== activePointerIdRef.current
      ) {
        return;
      }
      e.preventDefault();
      latestX = e.clientX;
      if (rafId === null) rafId = requestAnimationFrame(flush);
    };

    const finish = (e: PointerEvent) => {
      if (
        activePointerIdRef.current !== null &&
        e.pointerId !== activePointerIdRef.current
      ) {
        return;
      }
      e.preventDefault();
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (latestX !== null) seekFromClientX(latestX);
      activePointerIdRef.current = null;
      setIsDragging(false);
      onScrubEnd?.();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", finish, { passive: false });
    window.addEventListener("pointercancel", finish, { passive: false });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
    };
  }, [isDragging, onScrubEnd, seekFromClientX]);

  if (pixelPosition < 0) return null;

  return (
    <div
      ref={rootRef}
      className="absolute top-0 bottom-0 left-20 sm:left-32 z-[70] pointer-events-none"
      style={{
        transform: `translate3d(${pixelPosition}px, 0, 0)`,
        willChange: "transform",
        transition: isDragging ? "none" : "transform 70ms linear",
      }}
    >
      <div
        className={`absolute top-0 bottom-0 -translate-x-1/2 w-10 sm:w-5 pointer-events-auto touch-none select-none ${
          isDragging ? "cursor-grabbing" : "cursor-ew-resize"
        }`}
        onPointerDown={handlePointerDown}
        aria-label="Playhead"
        role="slider"
        aria-valuemin={0}
        aria-valuenow={Math.max(0, position)}
      >
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: "-1px" }}>
          <svg
            width="17"
            height="18"
            viewBox="0 0 13 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="sm:w-[13px] sm:h-[14px] drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"
          >
            <path d="M0.5 0H12.5V8L6.5 14L0.5 8V0Z" fill="#22c55e" />
          </svg>
        </div>
        <div
          className="absolute left-1/2 -translate-x-1/2 w-px bg-primary shadow-[0_0_10px_#22c55e]"
          style={{ top: "16px", bottom: 0 }}
        />
      </div>
    </div>
  );
};
