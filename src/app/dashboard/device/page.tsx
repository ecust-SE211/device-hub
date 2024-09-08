"use client";
import { Card, List } from "antd";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { LoadingPage, Title } from "@/components";
import Image from "next/image";
import { categoryInfoList } from "@/utils";
import Meta from "antd/es/card/Meta";

const typeData = [
  {
    id: "T000001",
    cid: "C001",
    name: "小烧杯",
    price: "20",
    explain: "非常烧的小烧杯",
  },
  {
    id: "T000001",
    cid: "C001",
    name: "小烧杯",
    price: "20",
    explain: "非常烧的小烧杯",
  },
  {
    id: "T000001",
    cid: "C001",
    name: "小烧杯",
    price: "20",
    explain: "非常烧的小烧杯",
  },
];

export default function HomePage(): ReactNode {
  const [category, _setCategory] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [typeList, setTypeList] = useState<typeof typeData>([]);
  const findTypesById = async (id: number) => {
    return new Promise<typeof typeData>((resolve, reject) => {
      typeData.forEach((data) => (data.name = `C0${id + 1}`));
      setTimeout(() => {
        resolve([
          ...[...typeData, ...typeData, ...typeData],
          ...[...typeData, ...typeData, ...typeData],
          ...[...typeData, ...typeData, ...typeData],
          ...[...typeData, ...typeData, ...typeData],
        ]);
      }, 1000);
    });
  };
  const fetchData = async () => {
    const data = await findTypesById(category);
    setTypeList(data);
    setIsLoading(false);
  };
  const setCategory = (id: number) => {
    setIsLoading(true);
    _setCategory(id);
    fetchData;
  };
  useEffect(() => {
    fetchData();
  });
  const renderCards = () => {
    if (isLoading) return <LoadingPage />;
    return typeList.map((typeInfo, index) => (
      <div
        key={index}
        className="w-40 flex flex-col bg-white rounded-xl border-t-4 border-teal-200 cursor-pointer"
      >
        <div className="flex">
          <Title size={1} title={typeInfo.id} />
        </div>
        <div
          className="flex flex-col items-center overflow-hidden h-24"
          style={{
            backgroundImage: `url(${categoryInfoList[category].image.src})`,
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
        </div>
        {/* <div className="px-2 text-sm text-gray-600">
        <span>Price: {typeInfo.price}</span>
      </div> */}
      </div>
    ));
  };
  return (
    <div className="flex w-full items-start gap-4">
      <div className="flex flex-col w-52 bg-white rounded-xl overflow-hidden">
        <div className="px-4 py-2 bg-teal-200 text-white text-lg font-semibold border-b-[0.125rem] border-white cursor-default">
          Device Category
        </div>
        {categoryInfoList.map((item, index) => (
          <div
            key={index}
            className={`px-4 py-2 zh transition-colors ${
              index == category
                ? "bg-teal-300 text-white cursor-default"
                : "text-teal-500 cursor-pointer"
            }`}
            onClick={
              index == category
                ? undefined
                : () => {
                    setCategory(index);
                  }
            }
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className="flex flex-col flex-wrap flex-1 gap-4">
        <Card title={<span className="zh">这里是筛选栏</span>} />
        <div className="flex min-h-[10rem] flex-wrap flex-1 gap-4 relative">
          {renderCards()}
          {/* <Card
            size="small"
            key={index}
            hoverable
            className="w-40"
            title={
              <div className="border-t-4 border-teal-200">{typeInfo.id}</div>
            }
            // extra={typeInfo.price}
            cover={
              <div
                className="flex flex-col items-center overflow-hidden h-32"
                style={{
                  backgroundImage: `url(${categoryInfo[category].image.src})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPositionX: "50%",
                }}
              />
            }
          >
            <Meta title={typeInfo.name} description={typeInfo.id} />
          </Card> */}
        </div>
      </div>
    </div>
  );
}
