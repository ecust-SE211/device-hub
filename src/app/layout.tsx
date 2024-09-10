import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import "./globals.css";
import { tealPrimary } from "./color";
import { ConfigProvider } from "antd";
function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="zh">
      <head>
        <title>DeviceHub</title>
      </head>
      <body className="w-full overflow-x-hidden">
        <div className="fixed w-full h-full overflow-hidden -z-10">
          <div
            className="absolute rounded-full bg-blue-600 opacity-10 blur-3xl"
            style={{ left: "-20%", top: "10%", width: "40%", height: "30%" }}
          ></div>
          <div
            className="absolute rounded-full bg-blue-400 opacity-10 blur-3xl"
            style={{ left: "15%", top: "-10%", width: "80%", height: "40%" }}
          ></div>
          <div
            className="absolute rounded-full bg-green-300 opacity-10 blur-2xl"
            style={{ right: "-5%", top: "0%", width: "30%", height: "30%" }}
          ></div>
        </div>
        <ConfigProvider
          theme={{
            token: {
              colorInfo: tealPrimary,
              colorLink: tealPrimary,
              colorPrimary: tealPrimary,
              padding: 12,
              paddingLG: 16,
            },
            components: {
              Card: {
                borderRadiusLG: 12,
              },
              Form: {
                itemMarginBottom: 12,
              },
            },
          }}
        >
          <AntdRegistry>{children}</AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}

export default RootLayout;
