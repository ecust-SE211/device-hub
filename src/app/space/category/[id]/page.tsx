"use client";
import { Card, Modal } from "antd";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { LoadingPage, Title } from "@/components";
import { categoryInfoMap } from "@/utils";
import { getTypeInfoListByCId, TypeInfoList } from "@/service";
import Search from "antd/es/input/Search";

interface Props {
  params: {
    id?: string;
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
  const { id: cid } = props.params;
  if (cid) {
    try {
      if (!categoryInfoMap.has(cid)) router.replace("/space/category/C001");
    } catch (error) {
      router.replace("/space/category/C001");
    }
  }
  // const temp = parseInt(params.category);

  const fetchData = async () => {
    setIsLoading(true);
    const fetchId = cid!;
    return getTypeInfoListByCId({
      id: fetchId,
    })
      .then((res) => {
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
      return `${item.id}${item.explain}${item.name}`.includes(query);
    });
    setTypeList(typeInfoList);
  };
  useEffect(() => {
    fetchData();
    // 使用空列表使方法只允许一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const renderCategoryItems = () => {
    const CardList: Array<ReactNode> = [];
    categoryInfoMap.forEach((item, key) =>
      CardList.push(
        <div
          key={key}
          className={`px-4 py-2 zh transition-colors ${
            key == cid
              ? "bg-teal-300 text-white cursor-default"
              : "text-teal-500 hover:bg-teal-100 cursor-pointer"
          }`}
          onClick={
            key == cid
              ? undefined
              : () => {
                  router.replace(`/space/category/${key}`);
                }
          }
        >
          {item.name}
        </div>
      )
    );
    return CardList;
  };
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
        className="w-40 pb-2 flex flex-col bg-white rounded-xl border-t-4 border-teal-200 cursor-pointer transition-shadow hover:shadow-md"
        onClick={() => {
          router.push(`/space/type/${typeInfo.id}`);
        }}
      >
        <div className="flex">
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
        </div>
      </div>
    ));
  };
  return (
    <div className="flex w-full items-start gap-4">
      <div className="flex flex-col w-52 bg-white rounded-xl overflow-hidden">
        <div className="px-4 py-2 bg-teal-200 text-white text-lg font-semibold border-b-[0.125rem] border-white cursor-default">
          Device Category
        </div>
        {renderCategoryItems()}
      </div>
      <div className="flex flex-col flex-wrap flex-1 gap-4">
        <Search
          className="max-w-[40rem]"
          size="large"
          allowClear
          onSearch={(query) => queryData(query)}
          enterButton={<span className="font-semibold">Query</span>}
        />
        <div className="flex min-h-[10rem] flex-wrap flex-1 gap-4 relative">
          {renderCards()}
        </div>
      </div>
    </div>
  );
}
