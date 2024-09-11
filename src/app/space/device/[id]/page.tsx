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
  findDeviceByDid,
  findDevicesByTid,
  findRepairApplicationsByDid,
  getTypeInfoByTid,
  RepairApplicationInfo,
  RepairApplicationInfoList,
  TypeInfo,
} from "@/service";
import Search from "antd/es/input/Search";
import { MenuOutlined, SelectOutlined } from "@ant-design/icons";
import {
  ApplicationInfo,
  ApplicationInfoList,
  ApplicationType,
  findApplicationsByDid,
} from "@/service/application";
import { ApplicationStatus, DeviceStatus } from "@/libs";
import Meta from "antd/es/card/Meta";

interface Props {
  params: {
    id?: string;
  };
}
export default function DevicePage(props: Props): ReactNode {
  const [fetchError, setFetchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");
  const [isLoading, setIsLoading] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo & { type: string }>({
    id: "",
    tid: "",
    status: 1,
    purchaseApplicationId: "",
    scrapApplicationId: "",
    storageTime: "",
    scrapTime: "",
    type: "",
    note: "",
  });
  const [repairApplicationList, setRepairApplicationList] =
    useState<RepairApplicationInfoList>([]);
  const router = useRouter();
  const { id } = props.params;

  const go = (href: string) => () => router.push(href);
  const back = () => router.back();

  const fetchData = async () => {
    setIsLoading(true);
    const fetchId = id!;
    return Promise.all([
      findDeviceByDid({
        id: fetchId,
      }).then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        setDeviceInfo(res.data!);
      }),
      findRepairApplicationsByDid({ id: fetchId }).then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        setRepairApplicationList(res.data!);
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
  /** 
   *   id: string;
  mid: string;
  lid?: string;
  status: ApplicationStatus;
  manufacturer: string;
  cost: number;
  rtime: string;
  atime?: string;
  ftime?: string;
  brief: string;
  note?: string;
   */
  const columns: TableProps<RepairApplicationInfo>["columns"] = [
    {
      title: "RID",
      dataIndex: "id",
      key: "id",
      render: (value) => (
        <span
          className="cursor-pointer"
          onClick={go(`/application/repair/${value}`)}
        >
          {value}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Waiting", value: 1 },
        { text: "Approved", value: 2 },
        { text: "Finished", value: 3 },
        { text: "Canceled", value: 4 },
      ],
      onFilter: (value, record) => record.status === value,
      render(value) {
        if (value === ApplicationStatus.Waiting)
          return <Tag color="warning">Waiting</Tag>;
        if (value === ApplicationStatus.Approved)
          return <Tag color="processing">Approved</Tag>;
        if (value === ApplicationStatus.Finished)
          return <Tag color="success">Finished</Tag>;
        if (value === ApplicationStatus.Canceled)
          return <Tag color="error">Canceled</Tag>;
        return <Tag color="default">Unknown</Tag>;
      },
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      render: (value) => <span>￥{value}</span>,
      sorter: (a, b) => a.cost - b.cost,
    },
    {
      title: "CreatedTime",
      dataIndex: "rtime",
      key: "rtime",
      sorter: (a, b) => a.rtime.localeCompare(b.rtime),
    },
    {
      title: "FinishedTime",
      dataIndex: "ftime",
      key: "ftime",
      sorter: (a, b) => a.rtime.localeCompare(b.rtime),
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
      <div className="flex flex-col flex-wrap flex-1 gap-4 ">
        <div className="flex items-stretch gap-4">
          <div className="-mt-1 pt-1 flex items-stretch rounded-xl bg-teal-400 transition-colors cursor-pointer">
            <Card
              title={<Title size={1} title="Device Info" />}
              className="w-52"
              style={{ border: "none", cursor: "default" }}
            >
              <Meta
                title={deviceInfo.id}
                className="zh"
                description={`Note: ${deviceInfo.note}`}
              />
              <div className="pt-4 -my-2">
                {(function () {
                  if (deviceInfo.status === DeviceStatus.Normal)
                    return <Tag color="success">Normal</Tag>;
                  if (deviceInfo.status === DeviceStatus.Repairing)
                    return <Tag color="warning">Repairing</Tag>;
                  if (deviceInfo.status === DeviceStatus.Scraped)
                    return <Tag color="error">Scraped</Tag>;
                })()}
              </div>
            </Card>
          </div>
          <div className="-mt-1 pt-1 flex items-stretch rounded-xl hover:bg-teal-200 transition-colors cursor-pointer">
            <Card
              hoverable
              title={<Title size={1} title="Type Info" pointer />}
              className="w-52"
              onClick={go(`/space/type/${deviceInfo.tid}`)}
            >
              <Meta
                title={deviceInfo.tid}
                className="zh"
                description={deviceInfo.type}
              />
            </Card>
          </div>
          <div className="-mt-1 pt-1 flex items-stretch rounded-xl hover:bg-teal-200 transition-colors cursor-pointer">
            <Card
              hoverable
              title={<Title size={1} title="Purchase Info" pointer />}
              className="w-52"
              onClick={go(
                `/space/application/purchase/${deviceInfo.purchaseApplicationId}`
              )}
            >
              <Meta
                title={deviceInfo.purchaseApplicationId}
                description={deviceInfo.storageTime}
              />
            </Card>
          </div>
          {deviceInfo.status == DeviceStatus.Scraped && (
            <div className="-mt-1 pt-1 flex items-stretch rounded-xl hover:bg-teal-200 transition-colors cursor-pointer">
              <Card
                hoverable
                title={<Title size={1} title="ScrapData" pointer />}
                className="w-52"
                onClick={go(
                  `/space/application/Scrap/${deviceInfo.scrapApplicationId}`
                )}
              >
                <Meta
                  title={deviceInfo.scrapApplicationId}
                  description={deviceInfo.scrapTime}
                />
              </Card>
            </div>
          )}
        </div>
        <Card title={<Title size={1} title="Repair Info" />}>
          <div className="flex flex-col gap-4">
            <Table columns={columns} dataSource={repairApplicationList} />
          </div>
        </Card>
      </div>
    </div>
  );
}
