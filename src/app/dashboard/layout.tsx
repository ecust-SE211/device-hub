"use client";
import { LoadingPage } from "@/components";
import { Affix, Modal } from "antd";
import React, { Suspense, useEffect, useState } from "react";
import { debounce, throttle } from "lodash";
import NavBar from "./components/NavBar";
import UserInfoCard from "./components/UserInfoCard";
import { isLogin } from "@/utils";
import { useRouter } from "next/navigation";
import { init, isInitialized } from "@/utils";
function DashBoardLayout({ children }: React.PropsWithChildren) {
  const [initError, setInitError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hiddenUserInfo, setHiddenUserInfo] = useState(true);
  const router = useRouter();
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
  const handleResize = throttle(() => {
    const isShrinking = window.innerWidth < 1188;
    if (isShrinking == hiddenUserInfo) {
      setHiddenUserInfo(!isShrinking);
    }
  }, 200);
  useEffect(() => {
    handleResize();
    if (!isInitialized()) {
      init()
        .then((res) => {
          setTimeout(() => {
            setIsLoading(false);
          }, 100);
        })
        .catch((err) => {
          setInitError(true);
        });
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
    window.addEventListener("scrollend", handleScrollEnd);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scrollend", handleScrollEnd);
      window.removeEventListener("resize", handleResize);
    };
  });

  // if (!isLogin()) {
  //   alert("You must login first.");
  //   router.push("/");
  //   // There will be a redirecting Page.
  //   return <LoadingPage />;
  // }
  if (isLoading) {
    let retrying = false;
    const handleRetry = () => {
      setInitError(false);
      if (retrying) return;
      retrying = true;
      init()
        .then((res) => {
          setTimeout(() => {
            setIsLoading(false);
          }, 100);
        })
        .catch((err) => {
          setInitError(true);
        });
    };
    const handleBack = () => {
      router.back();
    };
    return (
      <>
        <Modal
          title="Initialized Failed"
          open={initError}
          okText="Retry"
          onOk={handleRetry}
          cancelText="Back"
          onCancel={handleBack}
        >
          <span>
            Failed to load server resources, please try again or login again.
          </span>
        </Modal>
        <LoadingPage />
      </>
    );
  }
  return (
    <>
      <NavBar />
      <div
        className="w-full min-h-screen flex flex-col items-center overflow-x-hidden px-12 pt-14"
        style={{ minWidth: "50rem" }}
      >
        <main className="self-stretch flex justify-center gap-4 py-4">
          <article className="flex-1">
            <Suspense fallback={<LoadingPage />}>{children}</Suspense>
          </article>
          {hiddenUserInfo && (
            <aside style={{ width: "16rem" }}>
              <Affix offsetTop={20} style={{ zIndex: 10 }}>
                <UserInfoCard />
              </Affix>
            </aside>
          )}
        </main>
      </div>
      <footer className="flex flex-col items-center justify-center h-10 bg-teal-400">
        <span className="text-white">This isFooter</span>
      </footer>
    </>
  );
}

export default DashBoardLayout;
