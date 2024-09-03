"use client";
import { Button, Card } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import Title from "@/components/Title";
export default function HomePage(): ReactNode {
  const router = useRouter();
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <Card title={<Title size={1.5} style={{ minWidth: "300px" }} />}>
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
        </div>
      </Card>
    </div>
  );
}
