"use client";
import { Button, Card, Modal, Segmented, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { LoadingPage, Title } from "@/components";
import { categoryInfoMap, getId, getUserType } from "@/utils";
import {
  DeviceInfo,
  DeviceInfoList,
  findDeviceByDid,
  findDevicesByTid,
  getTypeInfoByTid,
  TypeInfo,
} from "@/service";
import Search from "antd/es/input/Search";
import {
  FileAddOutlined,
  MenuOutlined,
  SelectOutlined,
} from "@ant-design/icons";
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
    my?: boolean;
    option?: string;
  };
}
interface ApplicationInfoForDisplay {
  id: string;
  mid: string;
  lid?: string;
  status: ApplicationStatus;
  cost: string;
  rtime: string;
  ftime: string;
  // brief: string;
  // note: string;
  type: ApplicationType;
  urgent: boolean;
}
type ApplicationInfoForDisplayList = Array<ApplicationInfoForDisplay>;

enum OptionType {
  All = 0,
  Processing = 1,
  Finished = 2,
  Urgent = 3,
}

export default function ApplicationListPage(props: Props): ReactNode {
  const [fetchError, setFetchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");
  const [isLoading, setIsLoading] = useState(true);
  const [applicationDataMy, setApplicationDataMy] =
    useState<ApplicationInfoForDisplayList>([]);
  const [applicationData, setApplicationData] =
    useState<ApplicationInfoForDisplayList>([]);
  const applicationList = useRef<ApplicationInfoForDisplayList>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const my = searchParams.get("my");
  const option = searchParams.get("option");
  const [isMy, setIsMy] = useState(!!my);
  let tempOptionType: OptionType;
  if (option == "processing") tempOptionType = OptionType.Processing;
  else if (option == "finished") tempOptionType = OptionType.Finished;
  else if (option == "urgent") tempOptionType = OptionType.Urgent;
  else tempOptionType = OptionType.All;
  const [optionType, setOptionType] = useState<OptionType>(tempOptionType);

  const go = (href: string) => () => router.push(href);
  const back = () => router.back();
  const uid = getId();

  const fetchData = async () => {
    setIsLoading(true);
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
            mid,
            lid,
            status,
            cost,
            rtime,
            ftime = "",
            // brief,
            // note,
            type,
          } = application;
          const urgent = !!lid && status === ApplicationStatus.Waiting;
          return {
            id,
            mid,
            lid,
            status,
            cost: `${cost}`,
            rtime,
            ftime,
            type,
            urgent,
          };
        });
        applicationList.current = processedData;

        setApplicationData(processedData);
        setApplicationDataMy(
          getUserType() === "M"
            ? processedData.filter((item) => item.mid === uid)
            : processedData.filter((item) => item.lid === uid)
        );
        setIsLoading(false);
      })
      .catch((err) => {
        setErrorMessage(`${err}`);
        setFetchError(true);
      });
  };

  const queryData = (query: string) => {
    const applicationData = applicationList.current.filter((item) => {
      return `${item.id}${item.mid}${item.lid}${item.rtime}${item.ftime}`.includes(
        query
      );
    });
    setApplicationData(applicationData);
    setApplicationDataMy(
      getUserType() === "M"
        ? applicationData.filter((item) => item.mid === uid)
        : applicationData.filter((item) => item.lid === uid)
    );
  };

  useEffect(() => {
    fetchData();
  }, []);
  const columns: TableProps<ApplicationInfoForDisplay>["columns"] = [
    {
      title: "ApplicationID",
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
      title: "ManagerID",
      dataIndex: "mid",
      key: "mid",
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
      filteredValue: (function () {
        if (optionType == OptionType.Finished) return [3];
        if (optionType == OptionType.Processing) return [1, 2];
        return undefined;
      })(),
    },
    {
      title: "LeaderID",
      dataIndex: "lid",
      key: "lid",
    },
    {
      title: "Urgent",
      dataIndex: "urgent",
      key: "urgent",
      filters: [
        { text: "urgent", value: true },
        { text: "normal", value: false },
      ],
      onFilter: (value, record) => record.urgent === value,
      filteredValue: optionType == OptionType.Urgent ? [true] : undefined,
      render: (value) => {
        return value ? (
          <Tag color="error">Urgent</Tag>
        ) : (
          <Tag color="success">Normal</Tag>
        );
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
      <div className="flex flex-col flex-1 gap-4">
        <div className="bg-white rounded-xl p-4 border-teal-200 border-solid border-r-4 overflow-hidden">
          <div className="flex flex-col items-start gap-2">
            <div className="flex self-stretch gap-2">
              <Segmented
                defaultValue={isMy}
                options={[
                  { label: "All", value: false },
                  { label: "My", value: true },
                ]}
                onChange={(value) => setIsMy(value)}
              />
              <Segmented
                defaultValue={optionType}
                options={[
                  { label: "All", value: OptionType.All },
                  { label: "Processing", value: OptionType.Processing },
                  { label: "Finished", value: OptionType.Finished },
                  { label: "Urgent", value: OptionType.Urgent },
                ]}
                onChange={(value) => setOptionType(value)}
              />
              <div className="flex-1"></div>
              {getUserType() == "M" && (
                <Button
                  type="default"
                  icon={<FileAddOutlined />}
                  onClick={go("/space/application/purchase")}
                >
                  <span className="font-semibold">New Application</span>
                </Button>
              )}
            </div>
            <Search
              className="max-w-[40rem]"
              allowClear
              onSearch={(query) => queryData(query)}
              enterButton={<span className="font-semibold">Query</span>}
            />
          </div>
        </div>
        <Card>
          <div className="flex flex-col gap-4">
            {/* <Search
              className="max-w-[40rem]"
              size="large"
              allowClear
              onSearch={(query) => queryData(query)}
              enterButton={<span className="font-semibold">Query</span>}
            /> */}
            <Table
              columns={columns}
              dataSource={isMy ? applicationDataMy : applicationData}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
