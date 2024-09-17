"use client";
import { LoadingPage, Title } from "@/components";
import { Button, Card, Form, Input, message, Modal, Radio, Select } from "antd";
import FormItem from "antd/es/form/FormItem";
import { ReactNode, useEffect, useState } from "react";
import {
  appendRepairApplication,
  appendScrapApplication,
  getDeviceIds,
  RepairApplicationRequest,
  ScrapApplicationRequest,
} from "@/service";
import { useRouter } from "next/navigation";
import { getId, getUserType } from "@/utils";
import TextArea from "antd/es/input/TextArea";
export default function NewRepairApplication(): ReactNode {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");
  const [isLoading, setIsLoading] = useState(true);
  const [deviceIds, setDeviceIds] = useState<Array<string>>([]);
  const [form] = Form.useForm();
  const go = (href: string) => () => router.push(href);
  const back = () => router.back();
  const submit = (values: { mid: string; brief: string; devices: string }) => {
    if (submitting) return;
    setSubmitting(true);
    const request: ScrapApplicationRequest = {
      mid: values.mid,
      brief: values.brief,
      devices: values.devices.split("\n").map((id) => {
        return { id };
      }),
    };
    appendScrapApplication(request)
      .then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          messageApi.error(`Code :${code}\n${msg}`);
          setSubmitting(false);
          return;
        }

        router.push(`/space/application/scrap/${res.data!.id}`);
        setSubmitting(false);
        return;
      })
      .catch((err) => {
        messageApi.error(`${err}`);
        setSubmitting(false);
      });
  };
  const fetchData = async () => {
    return getDeviceIds()
      .then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        setDeviceIds(res.data!);
        setIsLoading(false);
      })
      .catch((err) => {
        setErrorMessage(`${err}`);
        setFetchError(true);
      });
  };
  useEffect(() => {
    if (getUserType() !== "M") back();
    void fetchData();
  }, []);
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
      {submitting && <LoadingPage cover />}
      <Card
        title={
          <Title
            size={1.5}
            style={{ minWidth: "300px" }}
            title="New Application"
            returnButton
          />
        }
        extra={
          <Radio.Group
            defaultValue={2}
            onChange={(e) => {
              [
                go("/space/application/purchase"),
                go("/space/application/repair"),
                go("/space/application/scrap"),
              ][e.target.value]();
            }}
          >
            <Radio.Button value={0}>Purchase</Radio.Button>
            <Radio.Button value={1}>Repair</Radio.Button>
            <Radio.Button value={2}>Scrap</Radio.Button>
          </Radio.Group>
        }
      >
        {contextHolder}
        <Form
          name="application"
          labelCol={{ span: 6 }}
          initialValues={{
            mid: getId(),
          }}
          form={form}
          onFinish={submit}
        >
          <FormItem name="mid" label="MID">
            <Input style={{ color: "#000" }} variant="borderless" disabled />
          </FormItem>
          <FormItem name="brief" label="Brief" required>
            <TextArea autoSize={true} />
          </FormItem>
          <FormItem
            label="Devices"
            name="devices"
            required
            rules={[
              () => ({
                validator(_, value: string) {
                  const idList = value.split("\n");
                  const idSet = new Set(idList);
                  if (idSet.size < idList.length)
                    return Promise.reject(
                      new Error("Cannot have two duplicate DeviceId.")
                    );
                  for (const did of idList) {
                    if (deviceIds.includes(did)) continue;
                    if (did == "")
                      return Promise.reject(
                        new Error(`Please do not enter blank lines.`)
                      );
                    return Promise.reject(
                      new Error(`"${did}" is not a legitimate DeviceId.`)
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <TextArea autoSize={true} placeholder="DeviceID (Split by wrap)" />
          </FormItem>
          <FormItem wrapperCol={{ offset: 6 }}>
            <Button className="w-40" type="primary" htmlType="submit">
              Submit
            </Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  );
}
