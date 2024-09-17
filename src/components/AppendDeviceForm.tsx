"use client";
import { Form, Input, message, Modal } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { LoadingPage } from "@/components";
import { appendDevices, DeviceRequest } from "@/service";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";

interface Props {
  fetchDataFunc: () => Promise<unknown>;
  onClose: () => void;
  pid: string;
  tid: string;
  tName: string;
  limit: number;
  visible: boolean;
}
export function AppendDeviceForm(props: Props): ReactNode {
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const submit = (value: DeviceRequest & { num: number }) => {
    console.log(value);
    if (isLoading) return;
    setIsLoading(true);
    appendDevices(value)
      .then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          messageApi.error(`Code :${code}\n${msg}`);
          return;
        }
        setIsLoading(false);
        props.fetchDataFunc().then((res) =>
          setTimeout(() => {
            messageApi.success("Append successfully.");
          }, 0)
        );
        props.onClose();
      })
      .catch((err) => {
        setIsLoading(false);
        messageApi.error(`${err}`);
      });
  };
  useEffect(() => {
    form.setFieldValue("tid", props.tid);
    form.setFieldValue("num", props.limit);
  }, [props]);

  return (
    <>
      {contextHolder}
      <Modal
        title="Append Device"
        open={props.visible}
        okText="Submit"
        onOk={form.submit}
        onCancel={isLoading ? () => {} : props.onClose}
      >
        {isLoading && <LoadingPage cover />}
        <Form
          name="append"
          labelCol={{ span: 6 }}
          initialValues={{
            pid: props.pid,
            tid: props.tid,
            num: props.limit,
          }}
          form={form}
          onFinish={submit}
        >
          <FormItem name="pid" label="PID">
            <Input style={{ color: "#000" }} variant="borderless" disabled />
          </FormItem>
          <FormItem name="tid" label="Tid">
            <Input style={{ color: "#000" }} variant="borderless" disabled />
          </FormItem>{" "}
          <FormItem label="TName">
            <Input
              value={props.tName}
              style={{ color: "#000" }}
              variant="borderless"
              disabled
            />
          </FormItem>
          <FormItem name="num" label="Num" required>
            <Input
              type="number"
              placeholder="number"
              min={1}
              max={props.limit}
              required
            />
          </FormItem>
          <FormItem name="manufacturer" label="Manufacturer">
            <TextArea autoSize={true} />
          </FormItem>
          <FormItem name="note" label="Note">
            <Input />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
}
