"use client";
import { Card, Descriptions, Modal, Statistic } from "antd";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { LoadingPage, Title } from "@/components";
import {
  ApplicationInfoList,
  findApplicationsByLid,
  findApplicationsByMid,
} from "@/service/application";
import {
  clearUserInfo,
  getEmail,
  getId,
  getName,
  getTel,
  getUserType,
} from "@/utils";
import { ApplicationStatus, CommonResponse } from "@/libs";
import {
  AlertOutlined,
  ClockCircleOutlined,
  LikeOutlined,
} from "@ant-design/icons";
export default function HomePage(): ReactNode {
  const router = useRouter();
  const applicationCount = useRef(0);
  const applicationFinishedCount = useRef(0);
  const applicationWaitingCount = useRef(0);
  const applicationUrgentCount = useRef(0);
  const [fetchError, setFetchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");
  const [isLoading, setIsLoading] = useState(true);
  const userType = getUserType();
  const isLeader = userType === "L";

  const go = (href: string) => () => router.push(href);
  const fetchData = useCallback(async () => {
    const id = getId()!;
    setIsLoading(true);
    let findApplicationFunc: (data: {
      id: string;
    }) => Promise<CommonResponse<ApplicationInfoList>>;
    if (isLeader) findApplicationFunc = findApplicationsByLid;
    else if (userType === "M") findApplicationFunc = findApplicationsByMid;
    else {
      clearUserInfo();
      router.back();
      return;
    }

    return Promise.all([
      findApplicationFunc({
        id,
      }).then((res) => {
        const { code, msg } = res;
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        if (isLeader) {
          applicationCount.current = res.data!.filter(
            (item) => item.lid === id
          ).length;

          let rest = res.data!.filter(
            (item) => item.status === ApplicationStatus.Waiting
          );
          applicationWaitingCount.current = rest.length;
          applicationUrgentCount.current = rest.filter(
            (item) => item.lid === id
          ).length;
          applicationFinishedCount.current =
            applicationCount.current - applicationUrgentCount.current;
        } else {
          let rest = res.data!.filter((item) => item.mid === id);
          applicationCount.current = rest.length;
          rest = rest.filter((item) => item.status < 3);
          applicationWaitingCount.current = rest.length;
          applicationUrgentCount.current = rest.filter(
            (item) => item.lid != undefined
          ).length;
          applicationFinishedCount.current =
            applicationCount.current - applicationWaitingCount.current;
        }
      }),
    ])
      .then((_) => {
        setIsLoading(false);
      })
      .catch((err) => {
        setErrorMessage(`${err}`);
        setFetchError(true);
      });
  }, [isLeader, router, userType]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    <div className="flex flex-col gap-4 items-start">
      <div className="-ml-2 px-2 max-w-[40rem] rounded-xl flex flex-col bg-teal-200">
        <Card
          title={
            <Title size={1.2} title="UserInfo" style={{ float: "left" }} />
          }
          bordered={false}
        >
          <Descriptions>
            <Descriptions.Item label="ID">{getId()}</Descriptions.Item>
            <Descriptions.Item label="UserName">{getName()}</Descriptions.Item>
            <Descriptions.Item label="Telephone">{getTel()}</Descriptions.Item>
            <Descriptions.Item label="Email">{getEmail()}</Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
      <div className="-ml-2 pl-2 max-w-[40rem] rounded-xl flex flex-col hover:bg-teal-200">
        <Card
          hoverable
          title={
            <Title
              size={1.2}
              title="Application"
              style={{ float: "left" }}
              onClick={go("/space/application?my=true")}
            />
          }
          bordered={false}
        >
          <div className="flex gap-6">
            <div
              className="flex-col -m-2 p-2 items-center min-w-20 rounded-lg hover:bg-teal-100"
              onClick={go("/space/application?my=true&option=finished")}
            >
              <Statistic
                title="Finished"
                value={`${applicationFinishedCount.current}/${applicationCount.current}`}
                prefix={<LikeOutlined />}
              />
            </div>
            <div
              className="flex-col -m-2 p-2 items-center min-w-20 rounded-lg hover:bg-teal-100"
              onClick={go("/space/application?my=true&option=processing")}
            >
              <Statistic
                title="Processing"
                value={applicationWaitingCount.current}
                prefix={<ClockCircleOutlined />}
              />
            </div>
            <div
              className="flex-col -m-2 p-2 items-center min-w-20 rounded-lg hover:bg-teal-100"
              onClick={go("/space/application?my=true&option=urgent")}
            >
              <Statistic
                title="Urgent"
                value={applicationUrgentCount.current}
                prefix={<AlertOutlined />}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
