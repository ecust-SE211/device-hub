"use client";
import { useRouter } from "next/navigation";

export default function Redirection() {
  const router = useRouter();
  router.replace("/dashboard/category/C001");
}
