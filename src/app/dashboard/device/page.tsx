"use client";
import { Card } from "antd";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Title } from "@/components";
export default function HomePage(): ReactNode {
  return (
    <Card
      style={{ height: "60rem" }}
      title={<Title size={1.5} className="w-full" useFavicon />}
    >
      There is Device.
    </Card>
  );
}
