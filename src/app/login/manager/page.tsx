"use client";
import { FlexCenter, LoadingPage, Title } from "@/components";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, notification } from "antd";
import FormItem from "antd/es/form/FormItem";
import { ReactNode, useState } from "react";
import { managerLogin } from "@/service";
import { useRouter } from "next/navigation";
export default function ManagerLogin(): ReactNode {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const [submitting, setSubmitting] = useState(false);
  const submit = (values: any) => {
    if (submitting) return;
    setSubmitting(true);
    managerLogin(values)
      .then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== 200) {
          messageApi.error(`Code :${code}\n${msg}`);
        }
        // localStorage.setItem()
        router.push("/dashboard");
        setSubmitting(false);
      })
      .catch((err) => {
        messageApi.error(`${err}`);
        setSubmitting(false);
      });
  };
  return (
    <FlexCenter>
      {submitting && <LoadingPage cover />}
      <Card
        title={
          <Title
            size={1.5}
            style={{ minWidth: "300px" }}
            title="Login As Manager"
            returnButton
          />
        }
      >
        {contextHolder}
        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ maxWidth: 360 }}
          onFinish={submit}
        >
          <FormItem
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </FormItem>
          <FormItem
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </FormItem>
          <FormItem>
            <Button block type="primary" htmlType="submit">
              Log in
            </Button>
          </FormItem>
        </Form>
      </Card>
    </FlexCenter>
  );
}
