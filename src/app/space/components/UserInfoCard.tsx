"use client";
import { LoadingPage } from "@/components";
import { Button, Form, Input, message, Popconfirm } from "antd";
import { useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";
import { EditOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import {
  clearUserInfo,
  getEmail,
  getId,
  getName,
  getTel,
  getUserType,
} from "@/utils";
import { leaderInfoEdit, managerInfoEdit } from "@/service";
export default function UserInfoCard(): ReactNode {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const infoEdit = getUserType() === "M" ? managerInfoEdit : leaderInfoEdit;
  const logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    localStorage.removeItem("tel");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    clearUserInfo();
    router.push("/");
  };
  const submit = (values: any) => {
    if (submitting) return;
    setSubmitting(true);
    const { tel, email } = values;
    if (tel === getTel() && email === getEmail()) {
      setSubmitting(false);
      setEditing(false);
      return;
    }
    infoEdit({ tel, email })
      .then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          messageApi.error(`Code :${code}\n${msg}`);
        }
        localStorage.setItem("tel", values.tel);
        localStorage.setItem("email", values.email);

        router.push("/space");
        setSubmitting(false);
        setEditing(false);
        messageApi.success("Modified successfully!");
      })
      .catch((err) => {
        messageApi.error(`${err}`);
        setSubmitting(false);
        setEditing(false);
      });
  };
  return (
    <div className="w-full bg-teal-200 p-1 rounded-2xl relative">
      {submitting && <LoadingPage />}
      {contextHolder}
      <div className="flex gap-2 items-center justify-center m-auto p-1 relative">
        <UserOutlined style={{ color: "#ffffff", fontSize: "1.25rem" }} />
        <span className="text-white text-xl cursor-default">
          {getUserType() === "M" ? "Manager" : "Leader"} Info
        </span>
        <UserOutlined style={{ visibility: "hidden", fontSize: "1.25rem" }} />
        <Popconfirm
          title="Log out"
          description="Are you sure you want to log out ?"
          onConfirm={logout}
          onCancel={() => {}}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            shape="circle"
            style={{
              position: "absolute",
              right: "0.5rem",
            }}
            icon={<LogoutOutlined style={{ color: "#ffffff" }} />}
          />
        </Popconfirm>
      </div>
      <div className="w-full bg-white rounded-xl px-4 py-2">
        <Form
          initialValues={{
            id: getId(),
            name: getName(),
            tel: getTel(),
            email: getEmail(),
          }}
          name="userInfo"
          labelCol={{ span: 6 }}
          onFinish={submit}
        >
          <FormItem name="id" label="ID">
            <Input
              style={{ color: "#0d9488", fontSize: "0.75rem" }}
              // defaultValue={getId()}
              disabled
            />
          </FormItem>
          <FormItem name="name" label="Name">
            <Input
              style={{ color: "#0d9488", fontSize: "0.75rem" }}
              // defaultValue={getName()}
              disabled
            />
          </FormItem>
          <FormItem name="tel" label="Tel">
            <Input
              style={{ color: "#0d9488", fontSize: "0.75rem" }}
              // defaultValue={getTel()}
              disabled={!editing}
            />
          </FormItem>
          <FormItem name="email" label="Email">
            <Input
              style={{ color: "#0d9488", fontSize: "0.75rem" }}
              // defaultValue={getEmail()}
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
