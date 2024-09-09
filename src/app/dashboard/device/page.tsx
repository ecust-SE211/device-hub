"use client";
import { LoadingPage } from "@/components";
import { useRouter } from "next/navigation";

export default function Redirection() {
  const router = useRouter();
  router.replace("/dashboard/device/0");
  // return <LoadingPage />;
}
