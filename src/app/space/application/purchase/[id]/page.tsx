"use client";
import { Button, Card, Descriptions, Modal, Steps, Table, Tag } from "antd";
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
  findPurchaseApplicationsByPid,
  findPurchaseRecordListByPid,
  findRepairApplicationsByDid,
  getTypeInfoByTid,
  PurchaseApplicationInfo,
  PurchaseRecord,
  PurchaseRecordList,
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
export default function PurchaseApplicationPage(props: Props): ReactNode {
  const [fetchError, setFetchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");
  const [isLoading, setIsLoading] = useState(true);
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
  const [pRListInfo, setPRListInfo] = useState<PurchaseRecordList>([]);
  const router = useRouter();
  const { id } = props.params;

  const go = (href: string) => () => router.push(href);
  const back = () => router.back();

  const fetchData = async () => {
    setIsLoading(true);
    const fetchId = id!;
    return Promise.all([
      findPurchaseApplicationsByPid({
        id: fetchId,
      }).then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        setPAInfo(res.data!);
      }),
      findPurchaseRecordListByPid({ id: fetchId }).then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        setPRListInfo(res.data!);
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
    // setIsLoading(false);
  }, []);
  const columns: TableProps<PurchaseRecord>["columns"] = [
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
      render: (value) => (
        <span className="cursor-pointer" onClick={go(`/space/type/${value}`)}>
          {value}
        </span>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value) => <span>￥{value}</span>,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Num",
      dataIndex: "num",
      key: "num",
      sorter: (a, b) => a.num - b.num,
    },
    {
      title: "Remain",
      dataIndex: "remain",
      key: "remain",
      sorter: (a, b) => a.remain - b.remain,
    },
    {
      title: "Option",
      render: (_, record) => {
        if (
          pAInfo.status != ApplicationStatus.Approved ||
          record.remain >= record.num
        )
          return <Button disabled>Append Device</Button>;
        return <Button>Append Device</Button>;
      },
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
    <div className="flex flex-col w-full items-start gap-4">
      <Card
        className="w-full"
        title={<Title size={1} title={`Purchase Application PW124184128-5`} />}
        style={{ border: "none", cursor: "default" }}
      >
        <Steps
          current={pAInfo.status - 1}
          items={[
            {
              title: pAInfo.status == 1 ? "Waiting" : "Approved",
              status:
                pAInfo.status == ApplicationStatus.Canceled
                  ? "wait"
                  : undefined,
            },
            {
              title: "Append Devices.",
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
        </Descriptions>
        <Table columns={columns} dataSource={pRListInfo} />
      </Card>
    </div>
  );
}
