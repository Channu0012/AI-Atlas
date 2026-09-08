"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmoothCategoryScrollProps {
  children: React.ReactNode;
  className?: string;
  scrollAmount?: number;
}

export const SmoothCategoryScroll: React.FC<SmoothCategoryScrollProps> = ({
  children,
  className,
  scrollAmount = 320
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScrollability = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkScrollability();
    const handleResize = () => checkScrollability();
    window.addEventListener("resize", handleResize);

    const observer = new ResizeObserver(() => checkScrollability());
    observer.observe(el);

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [checkScrollability]);

  const handleScroll = (direction: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    const delta = direction === "left" ? -scrollAmount : scrollAmount;
    el.scrollBy({ left: delta, behavior: "smooth" });
    setTimeout(checkScrollability, 350);
  };

  // Mouse drag-to-scroll support for desktop users
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    // Don't drag if user clicked directly on an interactive button or input
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest("input")) {
      return;
    }
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeftState - walk;
    checkScrollability();
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      checkScrollability();
    }
  };

  return (
    <div className={cn("relative group/scroll w-full", className)}>
      {/* Left Navigation Chevron */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => handleScroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-zinc-200 hover:text-white hover:bg-zinc-800 flex items-center justify-center shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-110 -ml-2 sm:-ml-3 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Left Gradient Edge Mask */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none z-10" />
      )}

      {/* Scrollable Content Container */}
      <div
        ref={containerRef}
        onScroll={checkScrollability}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={cn(
          "flex items-center gap-2 overflow-x-auto scrollbar-none no-scrollbar py-1 scroll-smooth select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        {children}
      </div>

      {/* Right Gradient Edge Mask */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none z-10" />
      )}

      {/* Right Navigation Chevron */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => handleScroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-zinc-200 hover:text-white hover:bg-zinc-800 flex items-center justify-center shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-110 -mr-2 sm:-mr-3 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
