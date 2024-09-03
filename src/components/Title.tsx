"use client";
import { DeploymentUnitOutlined, LeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { CSSProperties, MouseEventHandler, ReactNode } from "react";

type Props = {
  /** 文字尺寸(rem) */
  size: number;
  /** 行高(比例)默认1.3倍  */
  lineHeight?: number;
  /** Icon和标题的颜色 */
  color?: string;

  title?: string | ReactNode;
  className?: string;
  style?: CSSProperties | undefined;
  onClick?: MouseEventHandler<HTMLDivElement>;
  /** 添加返回按钮 */
  returnButton?: boolean;
  /** 显示网站标志 */
  useFavicon?: boolean;
};
export function Title(props: Props): ReactNode {
  const {
    size,
    lineHeight = 1.3,
    color = "#2dd4bf",
    title = "DeviceHub",
    className,
    style,
    onClick,
    returnButton,
    useFavicon,
  } = props;
  const router = useRouter();
  return (
    <div
      className={`flex items-center justify-center gap-2 cursor-pointer transition-colors ${className}`}
      style={style}
      onClick={onClick}
    >
      {returnButton && (
        <Button
          type="text"
          shape="circle"
          icon={
            <LeftOutlined
              style={{
                fontSize: `${size}rem`,
                lineHeight,
                color,
              }}
            />
          }
          onClick={router.back}
        />
      )}
      <div className="flex-1" />
      {useFavicon && (
        <DeploymentUnitOutlined
          style={{
            fontSize: `${size}rem`,
            lineHeight,
            color,
          }}
        />
      )}
      <div
        style={{
          fontSize: `${size}rem`,
          lineHeight,
          color,
        }}
      >
        {title}
      </div>
      <div className="flex-1" />
      {returnButton && (
        <Button
          type="primary"
          shape="circle"
          icon={
            <LeftOutlined
              style={{
                fontSize: `${size}rem`,
                lineHeight,
              }}
            />
          }
          style={{ visibility: "hidden" }}
        />
      )}
    </div>
  );
}
