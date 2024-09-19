"use client";
import { Form, Input, message, Modal } from "antd";
import { ReactNode, useState } from "react";
import { LoadingPage } from "@/components";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import { CommonResponse, RejectRequest } from "@/libs";

interface Props {
  fetchDataFunc: () => Promise<unknown>;
  cancelFunc: (_: RejectRequest) => Promise<CommonResponse<undefined>>;
  onClose: () => void;
  id: string;
  visible: boolean;
}
export function CancelApplicationDialog(props: Props): ReactNode {
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const submit = (value: RejectRequest) => {
    if (isLoading) return;
    setIsLoading(true);
    props
      .cancelFunc(value)
      .then((res) => {
        const { code, msg } = res;
        if (code !== "200") {
          messageApi.error(`Code :${code}\n${msg}`);
          return;
        }
        setIsLoading(false);
        props.fetchDataFunc().then((res) =>
          setTimeout(() => {
            messageApi.success("Cancel application successfully.");
          }, 0)
        );
        props.onClose();
      })
      .catch((err) => {
        setIsLoading(false);
        messageApi.error(`${err}`);
      });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Cancel Application"
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
            id: props.id,
          }}
          form={form}
          onFinish={submit}
        >
          <FormItem name="id" label="ApplicationID">
            <Input style={{ color: "#000" }} variant="borderless" disabled />
          </FormItem>
          <FormItem
            name="note"
            label="Note"
            rules={[
              {
                required: true,
                message: "Please input Note!",
              },
            ]}
            required
          >
            <TextArea autoSize={true} required />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
}
