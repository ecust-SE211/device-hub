"use client";
import { FlexCenter, Title } from "@/components";
import { managerLogin } from "@/service";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useRouter } from "next/navigation";

export default function ManagerLogin() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  var submitting = false;
  const submit = (values: any) => {
    if (submitting) return;
    submitting = true;
    managerLogin(values)
      .then((res) => {
        const { code, msg } = res;
        if (code !== 200) {
          messageApi.error(`Code :${code}\n${msg}`);
        }
        // localStorage.setItem()
        router.push("/dashboard");
      })
      .catch((err) => {
        messageApi.error(err);
      });
  };
  return (
    <FlexCenter>
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
