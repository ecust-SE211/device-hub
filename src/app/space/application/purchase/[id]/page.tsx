"use client";
import {
  Button,
  Card,
  Descriptions,
  message,
  Modal,
  Progress,
  Steps,
  Table,
} from "antd";
import type { TableProps } from "antd";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  LoadingPage,
  Title,
  AppendDeviceDialog,
  CancelApplicationDialog,
} from "@/components";
import { getUserType } from "@/utils";
import {
  approvePurchaseApplication,
  findPurchaseApplicationsByPid,
  findTypesByPid,
  finishPurchaseApplication,
  PurchaseApplicationInfo,
  PurchaseRecord,
  PurchaseRecordList,
  rejectPurchaseApplication,
} from "@/service";
import { ApplicationStatus } from "@/libs";
import Meta from "antd/es/card/Meta";

interface Props {
  params: {
    id: string;
  };
}
export default function PurchaseApplicationPage(props: Props): ReactNode {
  const [fetchError, setFetchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");
  const [isLoading, setIsLoading] = useState(true);
  const [isAppending, setIsAppending] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [appendIndex, setAppendIndex] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [pAInfo, setPAInfo] = useState<PurchaseApplicationInfo>({
    id: "",
    mid: "",
    lid: undefined,
    status: 3,
    cost: 0,
    rtime: "",
    atime: undefined,
    ftime: undefined,
    brief: "",
    note: undefined,
  });
  const [pRInfoList, setPRInfoList] = useState<PurchaseRecordList>([]);
  const router = useRouter();
  const { id } = props.params;
  const go = (href: string) => () => router.push(href);
  const isLeader = getUserType() === "L";
  const approve = () => {
    setIsLoading(true);
    void approvePurchaseApplication({
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
    void finishPurchaseApplication({
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
  const append = (index: number) => {
    setAppendIndex(index);
    setTimeout(() => {
      setIsAppending(true);
    }, 0);
  };
  const renderCancel = () => {
    if (pAInfo.status < 3)
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
      if (pAInfo.status === ApplicationStatus.Waiting)
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
    if (pAInfo.status > 2) return;
    if (pAInfo.status == 1)
      return (
        <>
          <Button type="primary" disabled>
            Finish
          </Button>
          {renderCancel()}
        </>
      );
    for (const pRInfo of pRInfoList) {
      if (pRInfo.remain !== 0)
        return (
          <>
            <Button type="primary" disabled>
              Finish
            </Button>
            {renderCancel()}
          </>
        );
    }
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
      findPurchaseApplicationsByPid({
        id,
      }).then((res) => {
        const { code, msg } = res;
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        setPAInfo(res.data!);
      }),
      findTypesByPid({ id }).then((res) => {
        const { code, msg } = res;
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        setPRInfoList(res.data!);
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
  const columns: TableProps<PurchaseRecord>["columns"] = [
    {
      key: "finish",
      render: (value, record) => (
        <Progress
          type="circle"
          size={50}
          percent={100 * (1 - record.remain / record.num)}
          format={() => `${record.num - record.remain}/${record.num}`}
        />
      ),
    },
    {
      title: "TID",
      dataIndex: "id",
      key: "id",
      render: (value) => (
        <span className="cursor-pointer" onClick={go(`/space/type/${value}`)}>
          {value}
        </span>
      ),
    },
    {
      title: "TypeName",
      dataIndex: "name",
      key: "name",
      render: (value, record) => (
        <span
          className="cursor-pointer"
          onClick={go(`/space/type/${record.id}`)}
        >
          {value}
        </span>
      ),
    },
    {
      title: "Num",
      dataIndex: "num",
      key: "num",
      sorter: (a, b) => a.num - b.num,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value) => <span>￥{value}</span>,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Total",
      dataIndex: "price",
      key: "price",
      render: (value) => <span>￥{value}</span>,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Remain",
      dataIndex: "remain",
      key: "remain",
      sorter: (a, b) => a.remain - b.remain,
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
      <AppendDeviceDialog
        fetchDataFunc={fetchData}
        onClose={() => {
          setIsAppending(false);
        }}
        visible={isAppending}
        pid={pAInfo.id}
        tid={pRInfoList[appendIndex].id}
        tName={pRInfoList[appendIndex].name}
        limit={pRInfoList[appendIndex].remain}
      />
      <CancelApplicationDialog
        fetchDataFunc={fetchData}
        cancelFunc={rejectPurchaseApplication}
        onClose={() => setIsCanceling(false)}
        visible={isCanceling}
        id={pAInfo.id}
      />
      <Card
        className="w-[60rem]"
        title={<Title returnButton size={1} title="Purchase Application" />}
        style={{ border: "none", cursor: "default" }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex">
            <Steps
              current={pAInfo.status - 1}
              items={[
                {
                  title:
                    pAInfo.status == ApplicationStatus.Waiting
                      ? "Waiting"
                      : "Approved",
                  status:
                    pAInfo.status == ApplicationStatus.Canceled
                      ? "wait"
                      : undefined,
                },
                {
                  title: "Purchasing",
                  status:
                    pAInfo.status == ApplicationStatus.Canceled
                      ? "wait"
                      : undefined,
                },
                {
                  title: "Finished",
                  status:
                    pAInfo.status == ApplicationStatus.Canceled
                      ? "wait"
                      : pAInfo.status === ApplicationStatus.Finished
                      ? "finish"
                      : "wait",
                },
                {
                  title: "Canceled",
                  status:
                    pAInfo.status == ApplicationStatus.Canceled
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
            title={pAInfo.id}
            description={`${pAInfo.mid} ${pAInfo.lid ? pAInfo.lid : ""}`}
          />
          <Descriptions>
            <Descriptions.Item label="Request Time">
              {pAInfo.rtime}
            </Descriptions.Item>
            <Descriptions.Item label="Approve Time">
              {pAInfo.atime}
            </Descriptions.Item>
            <Descriptions.Item label="Finish Time">
              {pAInfo.ftime}
            </Descriptions.Item>
            <Descriptions.Item label="Cost">￥{pAInfo.cost}</Descriptions.Item>
            <Descriptions.Item label="Brief">{pAInfo.brief}</Descriptions.Item>
            {pAInfo.note && (
              <Descriptions.Item label="Note">{pAInfo.note}</Descriptions.Item>
            )}
          </Descriptions>
          <Table
            title={() => <Title size={1} title="Device List" />}
            columns={
              isLeader
                ? columns
                : columns.concat({
                    title: "Option",
                    key: "option",
                    render: (_, record, index) => {
                      if (
                        pAInfo.status != ApplicationStatus.Approved ||
                        record.remain < 1
                      )
                        return <Button disabled>Append</Button>;
                      return (
                        <Button
                          onClick={() => {
                            append(index);
                          }}
                        >
                          Append
                        </Button>
                      );
                    },
                  })
            }
            dataSource={pRInfoList}
          />
        </div>
      </Card>
    </div>
  );
}
