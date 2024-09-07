"use client";
import { Card, List } from "antd";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { Title } from "@/components";
import textImage from "@/static/test.jpg";
import Image from "next/image";
export default function HomePage(): ReactNode {
  const [category, setCategory] = useState(1);
  const categoryInfo = [
    { id: 1, name: "电子仪器", image: textImage },
    { id: 2, name: "试剂", image: textImage },
    { id: 3, name: "玻璃容器", image: textImage },
    { id: 4, name: "物理仪器", image: textImage },
    { id: 5, name: "化学仪器", image: textImage },
    { id: 6, name: "计算机设备", image: textImage },
    { id: 7, name: "电子设备", image: textImage },
  ];
  return (
    // <div className="flex flex-wrap gap-4">
    //   {categoryInfo.map((info, index) => (
    //     <Card
    //       hoverable
    //       className="w-60"
    //       key={index}
    //       cover={<Image {...info.image} alt={info.name} />}
    //     >
    //       <span className="text-teal-600 font-bold">{info.name}</span>
    //     </Card>
    //   ))}
    // </div>
    <div className="flex w-full items-start gap-4">
      {/* <List
        className="bg-white"
        style={{
          borderColor: "#2dd4bf",
          borderWidth: "0rem",
        }}
        header={<div className=" bg-teal-200">Device Category</div>}
        bordered
        dataSource={categoryInfo}
        renderItem={(item) => (
          <List.Item
            className={`${category == item.id && "border-teal-400"}`}
            style={
              category == item.id
                ? {
                    // borderColor: "#2dd4bf",
                    // borderTopWidth: "0.125rem",
                    // borderBottomWidth: "0.125rem",
                    backgroundColor: "#99f6e4",
                  }
                : {
                    borderTop: "0",
                    borderBottom: "0",
                  }
            }
          >
            {item.name}
          </List.Item>
        )}
      /> */}
      <div className="flex flex-col bg-white rounded-xl overflow-hidden">
        <div className="px-4 py-2 bg-teal-200 text-white text-lg font-semibold">
          Device Category
        </div>
        {categoryInfo.map((item, index) => (
          <div key={index} className="px-4 py-2">
            {item.name}
          </div>
        ))}
      </div>
      <Card className="flex-1" style={{ height: "100rem" }}></Card>
    </div>
  );
}
