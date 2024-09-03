"use client";
import { Card, Button } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ReactNode } from "react";
import { Title, FlexCenter } from "@/components";
export default function HomePage(): ReactNode {
  const router = useRouter();
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
          <Link href="/loadingPage">Here is a loadingPage.</Link>
        </div>
      </Card>
    </FlexCenter>
  );
}
