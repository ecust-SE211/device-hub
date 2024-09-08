"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import "./css/animate.css";

type Props = {
  /** 页面蒙层 */
  cover?: boolean;
  /** 方块的旋转周期 ms*/
  rotateSpeed?: number;
  /** "..."的更新周期 ms*/
  duration?: number;
  /** 自定义加载文字说明 */
  message?: string;
};

export function LoadingPage(props: Props): ReactNode {
  const {
    cover,
    rotateSpeed = 1000,
    duration = 400,
    message = "Loading",
  } = props;
  const [loadingMessage, setLoadingMessage] = useState(" ");
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
    setLoadingMessage(message + dots);
  };
  useEffect(() => {
    /** 载入点点点动画 */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    currentTimeOut = setTimeout(() => requestAnimationFrame(getNextDots), 0);

    return () => {
      /** 卸载点点点动画 */
      clearTimeout(currentTimeOut);
    };
  }, []);
  return (
    <div
      className={`z-[100] -top-2 -left-2 -bottom-2 -right-2 flex flex-col items-center justify-center  backdrop-blur-sm ${
        cover ? "fixed" : "absolute"
      }`}
    >
      <div
        className="size-14 rounded-xl bg-white border-teal-200 border-2 border-solid"
        style={{
          animation: `rotation ${rotateSpeed}ms linear infinite`,
        }}
      />
      <span className="text-teal-400 font-bold text-base mt-1">
        {loadingMessage}
      </span>
    </div>
  );
}
