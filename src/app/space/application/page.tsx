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
  getTypeInfoByTid,
  TypeInfo,
} from "@/service";
import Search from "antd/es/input/Search";
import { MenuOutlined, SelectOutlined } from "@ant-design/icons";
import {
  ApplicationInfo,
  ApplicationInfoList,
  ApplicationType,
  findApplicationsByDid,
  getApplications,
} from "@/service/application";
import { ApplicationStatus } from "@/libs";

interface Props {
  params: {
    id?: string;
  };
}
interface ApplicationInfoForDisplay {
  id: string;
  status: ApplicationStatus;
  cost: string;
  rtime: string;
  ftime: string;
  // brief: string;
  // note: string;
  type: ApplicationType;
}
type ApplicationInfoForDisplayList = Array<ApplicationInfoForDisplay>;
export default function ApplicationPage(props: Props): ReactNode {
  const [fetchError, setFetchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");
  const [isLoading, setIsLoading] = useState(true);
  const [applicationData, setApplicationData] =
    useState<ApplicationInfoForDisplayList>([]);
  const applicationList = useRef<ApplicationInfoForDisplayList>([]);
  const router = useRouter();
  const { id } = props.params;

  const go = (href: string) => () => router.push(href);
  const back = () => router.back();

  const fetchData = async () => {
    setIsLoading(true);
    const fetchId = id!;
    return getApplications()
      .then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        const processedData = res.data!.map((application, index) => {
          const {
            id,
            status,
            cost,
            rtime,
            ftime = "",
            // brief,
            // note,
            type,
          } = application;
          return {
            id,
            status,
            cost: `${cost}`,
            rtime,
            ftime,
            type,
          };
        });
        applicationList.current = processedData;
        setApplicationData(processedData);
        setIsLoading(false);
      })
      .catch((err) => {
        setErrorMessage(`${err}`);
        setFetchError(true);
      });
  };

  const queryData = (query: string) => {
    const applicationData = applicationList.current.filter((item) => {
      return `${item.id}${item.rtime}${item.ftime}`.includes(query);
    });
    setApplicationData(applicationData);
  };
  useEffect(() => {
    fetchData();
    // 使用空列表使方法只允许一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const columns: TableProps<ApplicationInfoForDisplay>["columns"] = [
    {
      title: "ApplicationInfo",
      dataIndex: "id",
      key: "id",
      render(value, record) {
        let url = `/application/purchase/`;
        if (record.type == ApplicationType.Purchase)
          url = `/application/purchase/${value}`;
        else if (record.type == ApplicationType.Repair)
          url = `/application/repair/${value}`;
        else if (record.type == ApplicationType.Scrap)
          url = `/application/scrap/${value}`;
        else return <span>{value}</span>;
        return (
          <span className="cursor-pointer" onClick={go(url)}>
            {value}
          </span>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Purchase", value: 1 },
        { text: "Repair", value: 2 },
        { text: "Scrap", value: 3 },
      ],
      onFilter: (value, record) => record.type === value,
      render(value) {
        if (value === ApplicationType.Purchase)
          return <Tag color="success">Purchase</Tag>;
        if (value === ApplicationType.Repair)
          return <Tag color="processing">Repair</Tag>;
        if (value === ApplicationType.Scrap)
          return <Tag color="warning">Scrap</Tag>;
        return <Tag color="default">Unknown</Tag>;
      },
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
      sorter: (a, b) => {
        if (b.cost === "") return a.cost === "" ? 0 : parseInt(a.cost);
        if (a.cost === "") return -parseInt(b.cost);
        return parseInt(a.cost) - parseInt(b.cost);
      },
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
      <div className="flex flex-col flex-wrap flex-1 gap-4">
        <Card />

        <Card>
          <div className="flex flex-col gap-4">
            <Search
              className="max-w-[40rem]"
              size="large"
              allowClear
              onSearch={(query) => queryData(query)}
              enterButton={<span className="font-semibold">Query</span>}
            />
            <Table columns={columns} dataSource={applicationData} />
          </div>
        </Card>
      </div>
    </div>
  );
}
