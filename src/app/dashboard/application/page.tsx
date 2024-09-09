"use client";
import { Card, Modal } from "antd";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { LoadingPage, Title } from "@/components";
import { categoryInfoMap } from "@/utils";
import {
  getPurchaseApplications,
  getRepairApplications,
  getScrapApplications,
  getTypeInfoListById,
  PurchaseApplicationInfoList,
  RepairApplicationInfoList,
  ScrapApplicationInfoList,
  TypeInfoList,
} from "@/service";
import Search from "antd/es/input/Search";

export default function TypeListPage(): ReactNode {
  const [fetchError, setFetchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");
  const [isLoading, setIsLoading] = useState(true);
  const purchaseApplicationInfoList = useRef<PurchaseApplicationInfoList>([]);
  const repairApplicationInfoList = useRef<RepairApplicationInfoList>([]);
  const scrapApplicationInfoList = useRef<ScrapApplicationInfoList>([]);
  const router = useRouter();

  // const temp = parseInt(params.category);

  const fetchData = async () => {
    setIsLoading(true);
    return Promise.all([
      getPurchaseApplications().then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        purchaseApplicationInfoList.current = res.data!;
      }),
      getRepairApplications().then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        repairApplicationInfoList.current = res.data!;
      }),
      getScrapApplications().then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        scrapApplicationInfoList.current = res.data!;
      }),
    ])
      .then((_) => {
        setIsLoading(false);
      })
      .catch((err) => {
        setErrorMessage(`${err}`);
        setFetchError(true);
      });
  };
  useEffect(() => {
    fetchData();
    // 使用空列表使方法只允许一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const renderCards = (
    applicationList: Array<{ id: string }>,
    type: string
  ) => {
    if (isLoading)
      return (
        <>
          <Modal
            title="FetchData Failed"
            open={fetchError}
            okText="Retry"
            onOk={fetchData}
            cancelText="Back"
            onCancel={() => {
              router.back();
            }}
          >
            <span>{errorMessage}</span>
          </Modal>
          <LoadingPage />
        </>
      );
    return applicationList.map((typeInfo, index) => (
      <div
        key={index}
        className="w-40 pb-2 flex flex-col bg-white rounded-xl border-t-4 border-teal-200 cursor-pointer transition-shadow hover:shadow-md"
        onClick={() => {
          router.push(`/application/${type}/${typeInfo.id}`);
        }}
      >
        {/* <div className="flex">
          <Title size={1} title={typeInfo.id} />
        </div>
        <div
          className="flex flex-col items-center overflow-hidden h-24"
          style={{
            backgroundImage: `url(${categoryInfoMap.get(cid!)!.image.src})`,
            backgroundSize: "auto 100%",
            backgroundRepeat: "no-repeat",
            backgroundPositionX: "50%",
          }}
        />
        <div className="px-2 zh">
          <span>{typeInfo.name}</span>
        </div>
        <div className="px-2 text-xs zh text-gray-500">
          <span>{typeInfo.explain}</span>
        </div> */}
        {`${typeInfo}`}
      </div>
    ));
  };
  return (
    <div className="flex w-full items-start gap-4">
      <div className="flex flex-col flex-wrap flex-1 gap-4">
        <Card>Query</Card>
        <div className="flex min-h-[10rem] flex-wrap flex-1 gap-4 relative">
          {renderCards(purchaseApplicationInfoList.current, "purchase")}
        </div>
        <div className="flex min-h-[10rem] flex-wrap flex-1 gap-4 relative">
          {renderCards(repairApplicationInfoList.current, "repair")}
        </div>
        <div className="flex min-h-[10rem] flex-wrap flex-1 gap-4 relative">
          {renderCards(scrapApplicationInfoList.current, "scrap")}
        </div>
      </div>
    </div>
  );
}
