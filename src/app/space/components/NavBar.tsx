"use client";
import { Title } from "@/components";
import { throttle } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
export default function NavBar(): ReactNode {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const pathSplit = pathname.split("/");
  const spaceActive = pathSplit.length === 2;
  const deviceActive =
    pathSplit.length > 2 &&
    (pathSplit[2] === "category" ||
      pathSplit[2] === "type" ||
      pathSplit[2] === "device");
  const applicationActive =
    pathSplit.length > 2 && pathSplit[2] === "application";
  const handleScroll = throttle(() => {
    if (window.scrollY > 40 != scrolled) setScrolled(!scrolled);
  }, 200);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  return (
    <header
      className="w-full h-14 fixed flex gap-2 items-stretch justify-center px-12 py-2"
      style={{
        backdropFilter: "blur(0.5rem)",
        backgroundColor: scrolled ? "#ffffff50" : "#ffffff00",
        transition: "background-color 200ms linear",
        zIndex: 99,
      }}
    >
      <Title
        size={1.5}
        useFavicon
        className={
          spaceActive
            ? "border-teal-400 border-2 border-solid rounded-md px-2"
            : "hover:bg-[#0001] rounded-md ml-2.5"
        }
        onClick={spaceActive ? undefined : () => router.push("/space")}
      />
      {applicationActive && (
        <div className="flex items-center">
          <div className="h-5/6 w-0.5 bg-teal-400 " />
        </div>
      )}
      <Title
        size={1.5}
        title="Device"
        className={
          deviceActive
            ? "border-teal-400 border-2 border-solid rounded-md px-2"
            : "hover:bg-[#0001] rounded-md"
        }
        onClick={
          deviceActive ? undefined : () => router.push("/space/category/C001")
        }
      />
      {spaceActive && (
        <div className="flex items-center">
          <div className="h-5/6 w-0.5 bg-teal-400 " />
        </div>
      )}
      <Title
        size={1.5}
        title="Application"
        className={
          applicationActive
            ? "border-teal-400 border-2 border-solid rounded-md px-2"
            : "hover:bg-[#0001] rounded-md"
        }
        onClick={
          applicationActive
            ? undefined
            : () => router.push("/space/application")
        }
      />
      <div className="flex-1"></div>
    </header>
  );
}
