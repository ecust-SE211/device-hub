"use client";
import { FlexCenter, Title } from "@/components";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import { ReactNode } from "react";

export default function LeaderLogin(): ReactNode {
  const submit = (values: any) => {
    console.log("Received values of form: ", values);
  };
  return (
    <FlexCenter>
      <Card
        title={
          <Title
            size={1.5}
            style={{ minWidth: "300px" }}
            title="Login As Leader"
            returnButton
            useFavicon
          />
        }
      >
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
