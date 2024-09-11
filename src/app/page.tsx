"use client";
import { Card, Button } from "antd";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { Title, FlexCenter } from "@/components";
import { isLogin } from "@/utils";
export default function IndexPage(): ReactNode {
  const router = useRouter();
  useEffect(() => {
    if (isLogin()) router.push("/space");
  }, []);
  return (
    <FlexCenter>
      <Card title={<Title size={1.5} className="w-full" useFavicon />}>
        <div className="flex flex-col items-center gap-4 px-4">
          <Button
            className="self-stretch"
            size="large"
            onClick={() => router.push("/login/manager")}
          >
            Login As Manager
          </Button>
          <Button
            className="self-stretch"
            size="large"
            onClick={() => router.push("/login/leader")}
          >
            Login As Leader
          </Button>
        </div>
      </Card>
    </FlexCenter>
  );
}
