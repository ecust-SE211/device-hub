"use client";
import { LoadingPage, Title } from "@/components";
import { AppstoreAddOutlined, MinusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Modal, Radio, Select } from "antd";
import FormItem from "antd/es/form/FormItem";
import { ReactNode, useEffect, useState } from "react";
import { appendRepairApplication, findDevicesByStatus } from "@/service";
import { useRouter } from "next/navigation";
import { getId, getUserType } from "@/utils";
import FormList from "antd/es/form/FormList";
import TextArea from "antd/es/input/TextArea";
import { DeviceStatus } from "@/libs";
type Device = Array<{
  id: string;
}>;
export default function NewRepairApplication(): ReactNode {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");
  const [isLoading, setIsLoading] = useState(true);
  const [devices, setDevices] = useState<Device>([]);
  const [form] = Form.useForm();
  const go = (href: string) => () => router.push(href);
  const back = () => router.back();
  const submit = (values: any) => {
    if (submitting) return;
    setSubmitting(true);
    appendRepairApplication(values)
      .then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          messageApi.error(`Code :${code}\n${msg}`);
          setSubmitting(false);
          return;
        }

        router.push(`/space/application/repair/${res.data!.id}`);
        setSubmitting(false);
        return;
      })
      .catch((err) => {
        messageApi.error(`${err}`);
        setSubmitting(false);
      });
  };
  const fetchData = async () => {
    return findDevicesByStatus({ status: DeviceStatus.Normal })
      .then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        setDevices(
          res.data!.map((item) => {
            return {
              id: item.id,
            };
          })
        );
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
            defaultValue={1}
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
          labelCol={{ span: 4 }}
          initialValues={{
            mid: getId(),
          }}
          form={form}
          onFinish={submit}
        >
          <FormItem name="mid" label="MID">
            <Input style={{ color: "#000" }} variant="borderless" disabled />
          </FormItem>
          <FormItem name="manufacturer" label="Manufacturer" required>
            <Input />
          </FormItem>
          <FormItem name="cost" label="Cost" required>
            <Input type="number" />
          </FormItem>
          <FormItem
            label="Devices"
            name="devices"
            required
            rules={[
              () => ({
                validator(_, value) {
                  if (value ?? [].length > 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Need at least 1 type."));
                },
              }),
              () => ({
                validator(_, value) {
                  let idSet = new Set();
                  for (const item of value) {
                    if (idSet.has(item.id)) {
                      return Promise.reject(
                        new Error("Cannot have two duplicate types.")
                      );
                    }
                    idSet.add(item.id);
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <FormList name="types">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <FormItem key={field.key}>
                      <div className="flex gap-2">
                        <div className="flex-col flex-1">
                          <FormItem
                            name={[field.name, "id"]}
                            rules={[
                              () => ({
                                validator(_, value) {
                                  if (value === undefined)
                                    return Promise.reject(
                                      new Error("Please select a type.")
                                    );
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                          >
                            <Select
                              showSearch
                              placeholder="Select DeviceID"
                              optionFilterProp="label"
                              options={devices.map((item) => {
                                return { label: item.id, value: item.id };
                              })}
                            />
                          </FormItem>
                        </div>
                        <Button
                          icon={<MinusOutlined />}
                          onClick={() => {
                            remove(field.name);
                          }}
                        />
                      </div>
                    </FormItem>
                  ))}
                  <Button
                    icon={<AppstoreAddOutlined />}
                    type="dashed"
                    onClick={() => add()}
                    block
                  >
                    Add Device
                  </Button>
                </>
              )}
            </FormList>
          </FormItem>
          <FormItem name="brief" label="brief" required>
            <TextArea autoSize={true} />
          </FormItem>
          <FormItem wrapperCol={{ offset: 4 }}>
            <Button className="w-40" type="primary" htmlType="submit">
              Submit
            </Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  );
}
