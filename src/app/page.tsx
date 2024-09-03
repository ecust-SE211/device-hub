"use client";
import { Button, Card } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
const renderTitle = (): ReactNode => (
  <div className="flex items-center justify-center gap-2 min-w-[300px]">
    <div className="text-2xl">学生管理系统</div>
  </div>
);
export default function Home() {
  const router = useRouter();
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <Card title={renderTitle()}>
        <div className="flex flex-col items-center gap-2">
          <Button
            size="large"
            type="primary"
            onClick={() => router.push("/login")}
          >
            学生登陆
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={() => router.push("/login/admin")}
          >
            教师登陆
          </Button>
          <Link href="/login"></Link>
          <Link href="/login/admin"></Link>
        </div>{" "}
      </Card>
    </div>
  );
}
