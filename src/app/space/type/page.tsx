"use client";
import { useRouter } from "next/navigation";

export default function Redirection() {
  const router = useRouter();
  router.back();
}
