import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import "./globals.css";
function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="zh">
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
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}

export default RootLayout;
