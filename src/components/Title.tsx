import { DeploymentUnitOutlined } from "@ant-design/icons";
import { CSSProperties, MouseEventHandler, ReactNode } from "react";

type Props = {
  /** 文字尺寸(rem) */
  size: number;
  /** 行高(比例)默认1.3倍  */
  lineHeight?: number;
  /** Icon和标题的颜色 */
  color?: string;

  className?: string;
  style?: CSSProperties | undefined;
  onClick?: MouseEventHandler<HTMLDivElement>;
};
export default function Title(props: Props): ReactNode {
  const {
    size,
    lineHeight = 1.3,
    color = "#2dd4bf",
    className,
    style,
    onClick,
  } = props;
  return (
    <div
      className={`flex items-center justify-center gap-2 cursor-pointer transition-colors ${className}`}
      style={style}
      onClick={onClick}
    >
      <DeploymentUnitOutlined
        style={{
          fontSize: `${size}rem`,
          lineHeight,
          color,
        }}
      />
      <div
        style={{
          fontSize: `${size}rem`,
          lineHeight,
          color,
        }}
      >
        DeviceHub
      </div>
    </div>
  );
}
