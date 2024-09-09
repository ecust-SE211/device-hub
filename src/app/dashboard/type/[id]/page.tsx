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
export default function TypeListPage(props: Props): ReactNode {
  const [fetchError, setFetchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");
  const [isLoading, setIsLoading] = useState(true);
  const [deviceData, setDeviceData] = useState<DeviceInfoList>([]);
  const [typeInfo, setTypeInfo] = useState<TypeInfo>({
    id: "",
    name: "",
    price: "",
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
    // 使用空列表使方法只允许一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            onClick={go(`/dashboard/device/${value}`)}
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
                  `/dashboard/application/scraped/${record.scrapapplicationId}`
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
  return (
    <div className="flex w-full items-start gap-4">
      <div className="flex flex-col flex-wrap flex-1 gap-4">
        <Card>TypeInfo</Card>

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
