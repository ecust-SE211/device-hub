"use client";
import {
  Button,
  Card,
  Descriptions,
  Form,
  message,
  Modal,
  Steps,
  Table,
  Tag,
} from "antd";
import type { TableProps } from "antd";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { CancelApplicationDialog, LoadingPage, Title } from "@/components";
import { getUserType } from "@/utils";
import {
  approveScrapApplication,
  DeviceInfo,
  DeviceInfoList,
  findDevicesBySid,
  findScrapApplicationsBySid,
  finishScrapApplication,
  rejectScrapApplication,
  ScrapApplicationInfo,
} from "@/service";
import { ApplicationStatus } from "@/libs";
import Meta from "antd/es/card/Meta";

interface Props {
  params: {
    id: string;
  };
}
export default function ScrapApplicationPage(props: Props): ReactNode {
  const [fetchError, setFetchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");
  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [sAInfo, setSAInfo] = useState<ScrapApplicationInfo>({
    id: "",
    mid: "",
    lid: undefined,
    status: 3,
    rtime: "",
    atime: undefined,
    ftime: undefined,
    brief: "",
    note: undefined,
  });
  const [deviceList, setDeviceList] = useState<DeviceInfoList>([]);
  const router = useRouter();
  const { id } = props.params;
  const [form] = Form.useForm();
  const go = (href: string) => () => router.push(href);
  const isLeader = getUserType() === "L";
  const approve = () => {
    setIsLoading(true);
    void approveScrapApplication({
      id,
    })
      .then((res) => {
        const { code, msg } = res;
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        fetchData().then((res) =>
          setTimeout(() => {
            messageApi.success("Approve successfully.");
          }, 0)
        );
      })
      .catch((err) => {
        setErrorMessage(`${err}`);
        setFetchError(true);
      });
  };
  const finish = () => {
    setIsLoading(true);
    void finishScrapApplication({
      id,
    })
      .then((res) => {
        const { code, msg } = res;
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        fetchData().then((res) =>
          setTimeout(() => {
            messageApi.success("Finish successfully.");
          }, 0)
        );
      })
      .catch((err) => {
        setErrorMessage(`${err}`);
        setFetchError(true);
      });
  };
  const renderCancel = () => {
    if (sAInfo.status < 3)
      return (
        <Button
          onClick={() => {
            setIsCanceling(true);
          }}
        >
          Cancel
        </Button>
      );
  };
  const renderButton = () => {
    if (isLeader) {
      if (sAInfo.status === ApplicationStatus.Waiting)
        return (
          <>
            <Button type="primary" onClick={approve}>
              Approve
            </Button>
            {renderCancel()}
          </>
        );
      return (
        <>
          <Button type="primary" disabled>
            Approved
          </Button>
          {renderCancel()}
        </>
      );
    }
    if (sAInfo.status > 2) return;
    if (sAInfo.status == 1)
      return (
        <>
          <Button type="primary" disabled>
            Finish
          </Button>
          {renderCancel()}
        </>
      );
    return (
      <>
        <Button type="primary" onClick={finish}>
          Finish
        </Button>
        {renderCancel()}
      </>
    );
  };
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    return Promise.all([
      findScrapApplicationsBySid({
        id,
      }).then((res) => {
        const { code, msg } = res;
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        setSAInfo(res.data!);
      }),
      findDevicesBySid({ id }).then((res) => {
        const { code, msg } = res;
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        setDeviceList(res.data!);
      }),
    ])
      .then((_) => {
        setIsLoading(false);
      })
      .catch((err) => {
        setErrorMessage(`${err}`);
        setFetchError(true);
      });
  }, [id]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
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
          text: "Scraping",
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
        if (value === 2) return <Tag color="warning">Scraping</Tag>;
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
      title: "Manufacturer",
      dataIndex: "manufacter",
      key: "manufacturer",
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
    <div className="flex flex-col items-center">
      {contextHolder}
      <CancelApplicationDialog
        fetchDataFunc={fetchData}
        cancelFunc={rejectScrapApplication}
        onClose={() => setIsCanceling(false)}
        visible={isCanceling}
        id={sAInfo.id}
      />
      <Card
        className="w-[60rem]"
        title={<Title returnButton size={1} title="Scrap Application" />}
        style={{ border: "none", cursor: "default" }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex">
            <Steps
              current={sAInfo.status - 1}
              items={[
                {
                  title:
                    sAInfo.status == ApplicationStatus.Waiting
                      ? "Waiting"
                      : "Approved",
                  status:
                    sAInfo.status == ApplicationStatus.Canceled
                      ? "wait"
                      : undefined,
                },
                {
                  title: "Scraping",
                  status:
                    sAInfo.status == ApplicationStatus.Canceled
                      ? "wait"
                      : undefined,
                },
                {
                  title: "Finished",
                  status:
                    sAInfo.status == ApplicationStatus.Canceled
                      ? "wait"
                      : sAInfo.status === ApplicationStatus.Finished
                      ? "finish"
                      : "wait",
                },
                {
                  title: "Canceled",
                  status:
                    sAInfo.status == ApplicationStatus.Canceled
                      ? "error"
                      : undefined,
                },
              ]}
            />
            <div className="w-60 flex flex-row-reverse gap-4">
              {renderButton()}
            </div>
          </div>
          <Meta
            title={sAInfo.id}
            description={`${sAInfo.mid} ${sAInfo.lid ? sAInfo.lid : ""}`}
          />
          <Descriptions>
            <Descriptions.Item label="Request Time">
              {sAInfo.rtime}
            </Descriptions.Item>
            <Descriptions.Item label="Approve Time">
              {sAInfo.atime}
            </Descriptions.Item>
            <Descriptions.Item label="Finish Time">
              {sAInfo.ftime}
            </Descriptions.Item>
            <Descriptions.Item label="Brief">{sAInfo.brief}</Descriptions.Item>
            {sAInfo.note && (
              <Descriptions.Item label="Note">{sAInfo.note}</Descriptions.Item>
            )}
          </Descriptions>
          <Table
            title={() => <Title size={1} title="Device List" />}
            columns={columns}
            dataSource={deviceList}
          />
        </div>
      </Card>
    </div>
  );
}
