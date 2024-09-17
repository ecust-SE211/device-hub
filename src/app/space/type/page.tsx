"use client";
import { LoadingPage, Title } from "@/components";
import { Button, Card, Form, Input, message, Modal, Radio, Select } from "antd";
import FormItem from "antd/es/form/FormItem";
import { ReactNode, useEffect, useState } from "react";
import { appendType, TypeInfo } from "@/service";
import { useRouter } from "next/navigation";
import { categoryInfoList } from "@/utils";
import TextArea from "antd/es/input/TextArea";
export default function NewTypePage(): ReactNode {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const submit = async (values: TypeInfo) => {
    console.log(values);
    if (submitting) return;
    setSubmitting(true);
    appendType(values)
      .then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          messageApi.error(`Code :${code}\n${msg}`);
          setSubmitting(false);
          return;
        }

        router.push(`/space/type/${res.data!.id}`);
        // setSubmitting(false);
        return;
      })
      .catch((err) => {
        messageApi.error(`${err}`);
        setSubmitting(false);
      });
  };
  useEffect(() => {}, []);
  return (
    <div className="flex flex-col items-center">
      {submitting && <LoadingPage cover />}
      <Card
        title={
          <Title
            size={1.5}
            style={{ minWidth: "300px" }}
            title="New Type"
            returnButton
          />
        }
      >
        {contextHolder}
        <Form name="type" labelCol={{ span: 6 }} form={form} onFinish={submit}>
          <FormItem
            name="category"
            label="CID"
            rules={[
              {
                required: true,
                message: "Please select a category!",
              },
            ]}
            required
          >
            <Select
              showSearch
              placeholder="Select CategoryID"
              optionFilterProp="label"
              options={categoryInfoList.map((item) => {
                return { label: item.id, value: item.id };
              })}
            />
          </FormItem>
          <FormItem name="category" label="CName">
            <Select
              showSearch
              placeholder="Select CategoryName"
              optionFilterProp="label"
              options={categoryInfoList.map((item) => {
                return { label: item.name, value: item.id };
              })}
            />
          </FormItem>
          <FormItem
            name="name"
            label="TName"
            rules={[
              {
                required: true,
                message: "Please input TypeName!",
              },
            ]}
            required
          >
            <Input required />
          </FormItem>
          <FormItem
            name="price"
            label="Price"
            rules={[
              {
                required: true,
                message: "Please input Price!",
              },
            ]}
            required
          >
            <Input type="number" min={0} required />
          </FormItem>
          <FormItem
            name="explain"
            label="Explain"
            rules={[
              {
                required: true,
                message: "Please input Explain!",
              },
            ]}
            required
          >
            <TextArea autoSize={true} required />
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
