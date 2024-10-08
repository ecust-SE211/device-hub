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
  approveRepairApplication,
  DeviceInfo,
  DeviceInfoList,
  findDevicesByRid,
  findRepairApplicationsByRid,
  finishRepairApplication,
  rejectRepairApplication,
  RepairApplicationInfo,
} from "@/service";
import { ApplicationStatus } from "@/libs";
import Meta from "antd/es/card/Meta";

interface Props {
  params: {
    id: string;
  };
}
export default function RepairApplicationPage(props: Props): ReactNode {
  const [fetchError, setFetchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");
  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [rAInfo, setRAInfo] = useState<RepairApplicationInfo>({
    id: "",
    mid: "",
    lid: undefined,
    status: 3,
    manufacturer: "",
    cost: 0,
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
    void approveRepairApplication({
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
    void finishRepairApplication({
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
    if (rAInfo.status < 3)
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
      if (rAInfo.status === ApplicationStatus.Waiting)
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
    if (rAInfo.status > 2) return;
    if (rAInfo.status == 1)
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
      findRepairApplicationsByRid({
        id,
      }).then((res) => {
        const { code, msg } = res;
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        setRAInfo(res.data!);
      }),
      findDevicesByRid({ id }).then((res) => {
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
        cancelFunc={rejectRepairApplication}
        onClose={() => setIsCanceling(false)}
        visible={isCanceling}
        id={rAInfo.id}
      />
      <Card
        className="w-[60rem]"
        title={<Title returnButton size={1} title="Repair Application" />}
        style={{ border: "none", cursor: "default" }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex">
            <Steps
              current={rAInfo.status - 1}
              items={[
                {
                  title:
                    rAInfo.status == ApplicationStatus.Waiting
                      ? "Waiting"
                      : "Approved",
                  status:
                    rAInfo.status == ApplicationStatus.Canceled
                      ? "wait"
                      : undefined,
                },
                {
                  title: "Repairing",
                  status:
                    rAInfo.status == ApplicationStatus.Canceled
                      ? "wait"
                      : undefined,
                },
                {
                  title: "Finished",
                  status:
                    rAInfo.status == ApplicationStatus.Canceled
                      ? "wait"
                      : rAInfo.status === ApplicationStatus.Finished
                      ? "finish"
                      : "wait",
                },
                {
                  title: "Canceled",
                  status:
                    rAInfo.status == ApplicationStatus.Canceled
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
            title={rAInfo.id}
            description={`${rAInfo.mid} ${rAInfo.lid ? rAInfo.lid : ""}`}
          />
          <Descriptions>
            <Descriptions.Item label="Request Time">
              {rAInfo.rtime}
            </Descriptions.Item>
            <Descriptions.Item label="Approve Time">
              {rAInfo.atime}
            </Descriptions.Item>
            <Descriptions.Item label="Finish Time">
              {rAInfo.ftime}
            </Descriptions.Item>
            <Descriptions.Item label="Cost">￥{rAInfo.cost}</Descriptions.Item>
            <Descriptions.Item label="Manufacturer">
              {rAInfo.manufacturer}
            </Descriptions.Item>
            <Descriptions.Item label="Brief">{rAInfo.brief}</Descriptions.Item>
            {rAInfo.note && (
              <Descriptions.Item label="Note">{rAInfo.note}</Descriptions.Item>
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
