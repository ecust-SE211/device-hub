"use client";
import { LoadingPage, Title } from "@/components";
import { Affix, Button, Card, Form, Input, Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, Suspense, useEffect, useState } from "react";
import { debounce, throttle } from "lodash";
import { EditOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
export default function UserInfoCard(): ReactNode {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const handleFinish = (event: any) => {
    console.log(event);
    setEditing(false);
  };
  const id = "123456";
  const tel = "23333333333";
  const email = "wwj@devicehub.com";
  return (
    <div className="w-full bg-teal-200 p-1 rounded-2xl">
      <div className="flex gap-2 items-center justify-center m-auto p-1 relative">
        <UserOutlined style={{ color: "#ffffff", fontSize: "1.25rem" }} />
        <span className="text-white text-xl cursor-default">
          {"Manager"} Info
        </span>
        <UserOutlined style={{ visibility: "hidden", fontSize: "1.25rem" }} />
        <Button
          type="text"
          shape="circle"
          style={{
            position: "absolute",
            right: "0.5rem",
          }}
          icon={<LogoutOutlined style={{ color: "#ffffff" }} />}
          onClick={() => router.push("/")}
        />
      </div>
      <div className="w-full bg-white rounded-xl px-4 py-2">
        <Form
          initialValues={{
            id,
            tel,
            email,
          }}
          name="userInfo"
          labelCol={{ span: 6 }}
          onFinish={handleFinish}
        >
          <FormItem name="id" label="Id">
            <Input
              style={{ color: "#0d9488", fontSize: "0.75rem" }}
              defaultValue={123456}
              disabled
            />
          </FormItem>
          <FormItem label="Name">
            <Input
              style={{ color: "#0d9488", fontSize: "0.75rem" }}
              defaultValue={"王唯佳"}
              disabled
            />
          </FormItem>
          <FormItem name="tel" label="Tel">
            <Input
              style={{ color: "#0d9488", fontSize: "0.75rem" }}
              defaultValue={23333333333}
              disabled={!editing}
            />
          </FormItem>
          <FormItem name="email" label="Email">
            <Input
              style={{ color: "#0d9488", fontSize: "0.75rem" }}
              defaultValue={""}
              disabled={!editing}
            />
          </FormItem>
          <FormItem>
            <Button
              icon={<EditOutlined />}
              className="mr-4"
              type={editing ? "default" : "primary"}
              htmlType="button"
              onClick={() => setEditing(!editing)}
            >
              Edit
            </Button>
            <Button type="primary" htmlType="submit" disabled={!editing}>
              Submit
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  );
}
