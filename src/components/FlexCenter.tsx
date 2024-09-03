import { ReactNode } from "react";

export function FlexCenter({ children }: React.PropsWithChildren): ReactNode {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      {children}
    </div>
  );
}
