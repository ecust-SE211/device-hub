"use client";
import { Card, Modal } from "antd";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { LoadingPage, Title } from "@/components";
import { categoryInfoList } from "@/utils";
import { getTypeInfoListById, TypeInfoList } from "@/service";
import Search from "antd/es/input/Search";

interface Props {
  params: {
    category?: string;
  };
}
export default function TypeListPage(props: Props): ReactNode {
  // const [category, setCategory] = useState(temp);
  const [fetchError, setFetchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");
  const [isLoading, setIsLoading] = useState(true);
  const [typeList, setTypeList] = useState<TypeInfoList>([]);
  const typeData = useRef<TypeInfoList>([]);
  const router = useRouter();
  const { category } = props.params;
  let categoryIndex: number;
  if (category) {
    try {
      categoryIndex = parseInt(category);
      if (!categoryInfoList[categoryIndex])
        router.replace("/dashboard/device/0");
    } catch (error) {
      router.replace("/dashboard/device/0");
    }
  } else {
    categoryIndex = 0;
  }
  // const temp = parseInt(params.category);

  const fetchData = async () => {
    setIsLoading(true);
    const fetchId = categoryInfoList[categoryIndex].id;
    return getTypeInfoListById({
      id: fetchId,
    })
      .then((res) => {
        if (fetchId !== categoryInfoList[categoryIndex].id) return;
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        typeData.current = res.data!;
        setTypeList(res.data!);
        setIsLoading(false);
      })
      .catch((err) => {
        setErrorMessage(`${err}`);
        setFetchError(true);
      });
  };
  const queryData = (query: string) => {
    const typeInfoList = typeData.current.filter((item) => {
      return `${item.explain}${item.name}`.includes(query);
    });
    setTypeList(typeInfoList);
  };
  useEffect(() => {
    fetchData();
    // 使用空列表使方法只允许一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const renderCards = () => {
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
            backgroundImage: `url(${categoryInfoList[categoryIndex].image.src})`,
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
              index == categoryIndex
                ? "bg-teal-300 text-white cursor-default"
                : "text-teal-500 cursor-pointer"
            }`}
            onClick={
              index == categoryIndex
                ? undefined
                : () => {
                    router.replace(`/dashboard/device/${index}`);
                  }
            }
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className="flex flex-col flex-wrap flex-1 gap-4">
        <Search
          className="max-w-[40rem]"
          allowClear
          onSearch={(query) => queryData(query)}
          enterButton="Query"
        />
        <div className="flex min-h-[10rem] flex-wrap flex-1 gap-4 relative">
          {renderCards()}
        </div>
      </div>
    </div>
  );
}
