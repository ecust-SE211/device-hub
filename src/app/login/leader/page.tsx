"use client";
import { FlexCenter, LoadingPage, Title } from "@/components";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message } from "antd";
import FormItem from "antd/es/form/FormItem";
import { ReactNode, useState } from "react";
import { leaderLogin } from "@/service";
import { useRouter } from "next/navigation";
export default function LeaderLogin(): ReactNode {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [submitting, setSubmitting] = useState(false);

  const submit = (values: any) => {
    if (submitting) return;
    setSubmitting(true);
    leaderLogin(values)
      .then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          messageApi.error(`Code :${code}\n${msg}`);
          setSubmitting(false);
          return;
        }
        const { id, name, tel, email, token } = res.data!;
        localStorage.setItem("id", id);
        localStorage.setItem("name", name);
        localStorage.setItem("tel", tel);
        localStorage.setItem("email", email);
        localStorage.setItem("token", token);
        localStorage.setItem("userType", "L");

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
            title="Login As Leader"
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
            name="id"
            rules={[{ required: true, message: "Please input current id!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Id" />
          </FormItem>
          <FormItem
            name="pwd"
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
