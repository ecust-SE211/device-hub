"use client";
import { LoadingPage } from "@/components";
import { Affix } from "antd";
import React, { Suspense, useEffect, useState } from "react";
import { debounce } from "lodash";
import NavBar from "./components/NavBar";
import UserInfoCard from "./components/UserInfoCard";
import { isLogin } from "@/utils";
import { useRouter } from "next/navigation";
function DashBoardLayout({ children }: React.PropsWithChildren) {
  const router = useRouter();
  if (!isLogin()) {
    alert("You must login first.");
    router.push("/");
  }

  const handleScrollEnd = debounce(() => {
    const scrollAnchor =
      document.documentElement.offsetHeight -
      document.documentElement.clientHeight -
      40;
    if (scrollAnchor < window.scrollY) {
      window.scrollTo({
        top: scrollAnchor,
        behavior: "smooth",
      });
    }
  }, 200);
  useEffect(() => {
    window.addEventListener("scrollend", handleScrollEnd);
    return () => {
      window.removeEventListener("scrollend", handleScrollEnd);
    };
  });
  return (
    <>
      <NavBar />
      <div
        className="w-full min-h-screen flex flex-col items-center overflow-x-hidden px-12 pt-14"
        style={{ minWidth: "50rem" }}
      >
        <main className="self-stretch flex justify-center gap-8 py-4">
          <article style={{ flexGrow: "4" }}>
            <Suspense fallback={<LoadingPage />}>{children}</Suspense>
          </article>

          <aside
            style={{
              maxWidth: "16rem",
              flexGrow: "1",
            }}
          >
            <Affix offsetTop={20} style={{ zIndex: 10 }}>
              <UserInfoCard />
            </Affix>
          </aside>
        </main>
      </div>
      <footer className="flex flex-col items-center justify-center h-10 bg-teal-400">
        <span className="text-white">This isFooter</span>
      </footer>
    </>
  );
}

export default DashBoardLayout;
