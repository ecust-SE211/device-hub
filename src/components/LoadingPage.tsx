"use client";
import { ReactNode, useEffect, useRef } from "react";
import "./animate.css";

type Props = {
  /** 方块的旋转周期 ms*/
  rotateSpeed?: number;
  /** "..."的更新周期 ms*/
  duration?: number;
  /** 自定义加载文字说明 */
  message?: string;
};

export default function LoadingPage(props: Props): ReactNode {
  const { rotateSpeed = 1000, duration = 400, message = "Loading" } = props;
  const loadingSpan = useRef<HTMLSpanElement>(null);
  let dots = "....";
  let currentTimeOut: NodeJS.Timeout = null!;
  const getNextDots = () => {
    currentTimeOut = setTimeout(
      () => requestAnimationFrame(getNextDots),
      duration
    );
    const nextDots: Record<string, string> = {
      ".": "..",
      "..": "...",
      "...": "....",
      "....": ".",
    };
    dots = nextDots[dots];
    loadingSpan.current!.innerHTML = message + dots;
  };
  const handleGetNextDots = () => {
    if (!loadingSpan) return;
    requestAnimationFrame(getNextDots);
  };
  useEffect(() => {
    /** 载入点点点动画 */
    currentTimeOut = setTimeout(handleGetNextDots, 0);

    return () => {
      /** 卸载点点点动画 */
      clearTimeout(currentTimeOut);
    };
  });
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div
        className="size-14 rounded-xl bg-white border-teal-200 border-2 border-solid"
        style={{
          animation: `rotation ${rotateSpeed}ms linear infinite`,
        }}
      />
      <span
        ref={loadingSpan}
        className="text-teal-500 font-bold text-base mt-1"
      >
        .
      </span>
    </div>
  );
}
