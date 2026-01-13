"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: any;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (currentDirection: Direction): Direction => {
    switch (currentDirection) {
      case "TOP":
        return "RIGHT";
      case "RIGHT":
        return "BOTTOM";
      case "BOTTOM":
        return "LEFT";
      default:
        return "TOP";
    }
  };

  const mapDirectionToGradient = (dir: Direction) => {
    switch (dir) {
      case "TOP":
        return "radial-gradient(20.7% 50% at 50% 0%, #3b82f6 0%, rgba(255, 255, 255, 0) 100%)";
      case "LEFT":
        return "radial-gradient(16.6% 43.1% at 0% 50%, #3b82f6 0%, rgba(255, 255, 255, 0) 100%)";
      case "BOTTOM":
        return "radial-gradient(20.7% 50% at 50% 100%, #3b82f6 0%, rgba(255, 255, 255, 0) 100%)";
      case "RIGHT":
        return "radial-gradient(16.2% 41.199999999999996% at 100% 50%, #3b82f6 0%, rgba(255, 255, 255, 0) 100%)";
      default:
        return "radial-gradient(20.7% 50% at 50% 0%, #3b82f6 0%, rgba(255, 255, 255, 0) 100%)";
    }
  };

  const highlight =
    "radial-gradient(75% 181.15942028985506% at 50% 50%, #3b82f6 0%, rgba(255, 255, 255, 0) 100%)";

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration]);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex content-center bg-white/10 hover:bg-white/20 transition duration-500 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit rounded-full",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "relative w-auto text-white z-10 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-[inherit]",
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className={cn(
          "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        )}
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: mapDirectionToGradient(direction) }}
        animate={{
          background: hovered
            ? [mapDirectionToGradient(direction), highlight]
            : mapDirectionToGradient(direction),
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      <div className="bg-black absolute inset-[2px] flex-none z-0 rounded-[inherit]" />
    </Tag>
  );
}
