"use client";
import { Button, Card, Modal, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { LoadingPage, Title } from "@/components";
import { categoryInfoMap } from "@/utils";
import {
  DeviceInfo,
  DeviceInfoList,
  findDevicesByTid,
  getTypeInfoByTid,
  TypeInfo,
} from "@/service";
import Search from "antd/es/input/Search";
import { MenuOutlined, SelectOutlined } from "@ant-design/icons";

interface Props {
  params: {
    id?: string;
  };
}
export default function TypePage(props: Props): ReactNode {
  const [fetchError, setFetchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");
  const [isLoading, setIsLoading] = useState(true);
  const [deviceData, setDeviceData] = useState<DeviceInfoList>([]);
  const [typeInfo, setTypeInfo] = useState<TypeInfo>({
    id: "",
    name: "",
    price: "",
    category: "",
  });
  const deviceList = useRef<DeviceInfoList>([]);
  const router = useRouter();
  const { id } = props.params;

  const go = (href: string) => () => router.push(href);
  const back = () => router.back();
  // const temp = parseInt(params.category);

  const fetchData = async () => {
    setIsLoading(true);
    const fetchId = id!;
    return Promise.all([
      findDevicesByTid({
        id: fetchId,
      }).then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        deviceList.current = res.data!.map((item, index) => {
          item.key = index;
          return item;
        });
        setDeviceData(deviceList.current);
      }),
      getTypeInfoByTid({ id: fetchId }).then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        setTypeInfo(res.data!);
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

  const queryData = (query: string) => {
    const typeInfoList = deviceList.current.filter((item) => {
      return `${item.id}${item.explain}${item.name}`.includes(query);
    });
    setDeviceData(typeInfoList);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const columns: TableProps<DeviceInfo>["columns"] = [
    {
      title: "DeviceID",
      dataIndex: "id",
      key: "id",
      render(value) {
        return (
          <span
            className="cursor-pointer"
            onClick={go(`/space/device/${value}`)}
          >
            {value}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Normal",
          value: 1,
        },
        {
          text: "Repairing",
          value: 2,
        },
        {
          text: "Scraped",
          value: 3,
        },
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.status === value,
      render(value, record, index) {
        if (value === 1) return <Tag color="success">Normal</Tag>;
        if (value === 2) return <Tag color="warning">Repairing</Tag>;
        if (value === 3)
          return (
            <Tag
              className="cursor-pointer"
              color="error"
              onClick={() =>
                router.push(
                  `/space/application/scraped/${record.scrapApplicationId}`
                )
              }
            >
              Scraped
            </Tag>
          );
        return <Tag color="default">Unknown</Tag>;
      },
    },
    {
      title: "Manufacter",
      dataIndex: "manufacter",
      key: "manufacter",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "StorageTime",
      dataIndex: "storageTime",
      key: "storageTime",

      sorter: (a, b) => a.storageTime.localeCompare(b.storageTime),
    },
  ];
  if (isLoading)
    return (
      <>
        <Modal
          title="FetchData Failed"
          open={fetchError}
          okText="Retry"
          onOk={() => {
            setFetchError(false);
            fetchData();
          }}
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
  return (
    <div className="flex w-full items-start gap-4">
      <div className="flex flex-col flex-wrap flex-1 gap-4">
        <div className="rounded-xl inline-flex overflow-hidden">
          <div
            className="w-64 h-44 flex flex-col items-center overflow-hidden relative"
            style={{
              backgroundImage: `url(${
                categoryInfoMap.get(typeInfo!.category)!.image.src
              })`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPositionX: "50%",
            }}
          >
            <div
              className="h-52 w-24 right-0 absolute"
              style={{
                backgroundImage: "linear-gradient(270deg,#ffffff,#ffffff00)",
              }}
            />
          </div>
          <div className="p-2 flex flex-col items-start bg-white">
            <div className="w-full h-8 flex gap-2">
              <div className="text-teal-600">ID: </div>
              <div className="text-teal-600">{typeInfo.id}</div>
            </div>
            <div className="w-full h-8 zh flex items-end">
              <div className="text-lg text-teal-600">{typeInfo.name}</div>
            </div>
            <div className="w-full h-6 zh flex items-end">
              <div className="text-base text-teal-600">￥{typeInfo.price}</div>
            </div>
            <div className="w-full h-18 flex">
              <div className="text-sm zh text-teal-700 text-ellipsis text-wrap">
                {typeInfo.explain}
              </div>
            </div>
          </div>
          <div
            className="flex-1 self-stretch max-w-60 rounded-r-xl"
            style={{
              backgroundImage: "linear-gradient(90deg,#ffffff,#99f6e4)",
            }}
          />
        </div>

        <Card>
          <div className="flex flex-col gap-4">
            <Search
              className="max-w-[40rem]"
              size="large"
              allowClear
              onSearch={(query) => queryData(query)}
              enterButton={<span className="font-semibold">Query</span>}
            />
            <Table columns={columns} dataSource={deviceData} />
          </div>
        </Card>
      </div>
    </div>
  );
}
