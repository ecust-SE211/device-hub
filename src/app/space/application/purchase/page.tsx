"use client";
import { LoadingPage, Title } from "@/components";
import { AppstoreAddOutlined, MinusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Modal, Radio, Select } from "antd";
import FormItem from "antd/es/form/FormItem";
import { ReactNode, useEffect, useState } from "react";
import {
  appendPurchaseApplication,
  getTypes,
  TypeListResponse,
} from "@/service";
import { useRouter } from "next/navigation";
import { getId, getUserType } from "@/utils";
import FormList from "antd/es/form/FormList";
import TextArea from "antd/es/input/TextArea";
export default function NewPurchaseApplication(): ReactNode {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");
  const [isLoading, setIsLoading] = useState(true);
  const [types, setTypes] = useState<TypeListResponse>([]);
  const [typePrice, setTypePrice] = useState<Map<string, number>>(new Map());
  const [form] = Form.useForm();
  const go = (href: string) => () => router.push(href);
  const back = () => router.back();
  const submit = (values: any) => {
    if (submitting) return;
    setSubmitting(true);
    appendPurchaseApplication(values)
      .then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          messageApi.error(`Code :${code}\n${msg}`);
          setSubmitting(false);
          return;
        }

        router.push(`/space/application/purchase/${res.data!.id}`);
        setSubmitting(false);
        return;
      })
      .catch((err) => {
        messageApi.error(`${err}`);
        setSubmitting(false);
      });
  };
  const fetchData = async () => {
    return getTypes()
      .then((res) => {
        const { code, msg } = res;
        console.log(res);
        if (code !== "200") {
          setErrorMessage(`Code :${code}\n${msg}`);
          setFetchError(true);
          return;
        }
        setTypes(res.data!);
        let typePriceMap = new Map();
        res.data!.forEach((type) => typePriceMap.set(type.id, type.price));
        setTypePrice(typePriceMap);
        typePrice;
        setIsLoading(false);
      })
      .catch((err) => {
        setErrorMessage(`${err}`);
        setFetchError(true);
      });
  };
  const handleGetCost = () => {
    const types = form.getFieldValue(["types"]);
    let sum = 0;
    for (const type of types) {
      if (type === undefined || type.id === undefined || type.num === undefined)
        continue;
      sum += parseFloat(type.num) * typePrice.get(type.id)!;
    }
    form.setFieldValue("cost", sum);
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
            defaultValue={0}
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
          labelCol={{ span: 6 }}
          initialValues={{
            mid: getId(),
            cost: 0,
          }}
          form={form}
          onFinish={submit}
        >
          <FormItem name="mid" label="MID">
            <Input style={{ color: "#000" }} variant="borderless" disabled />
          </FormItem>
          <FormItem name="cost" label="Cost">
            <Input style={{ color: "#000" }} variant="borderless" disabled />
          </FormItem>
          <FormItem
            label="Types"
            name="types"
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
                              placeholder="Select TypeID"
                              optionFilterProp="label"
                              options={types.map((item) => {
                                return { label: item.id, value: item.id };
                              })}
                              onChange={handleGetCost}
                            />
                          </FormItem>
                          <FormItem name={[field.name, "id"]}>
                            <Select
                              showSearch
                              placeholder="Select TypeName"
                              optionFilterProp="label"
                              options={types.map((item) => {
                                return { label: item.name, value: item.id };
                              })}
                              onChange={handleGetCost}
                            />
                          </FormItem>
                          <FormItem name={[field.name, "id"]}>
                            <Select
                              disabled
                              showSearch
                              placeholder="Display Price"
                              optionFilterProp="label"
                              options={types.map((item) => {
                                return { label: item.price, value: item.id };
                              })}
                            />
                          </FormItem>
                          <FormItem
                            name={[field.name, "num"]}
                            rules={[
                              () => ({
                                validator(_, value) {
                                  if (value < 1)
                                    return Promise.reject(
                                      new Error(
                                        "The number must be greater than 0."
                                      )
                                    );
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                          >
                            <Input
                              type="number"
                              placeholder="Input Number"
                              onChange={handleGetCost}
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
                    Add Type
                  </Button>
                </>
              )}
            </FormList>
          </FormItem>
          <FormItem
            name="brief"
            label="brief"
            rules={[
              {
                required: true,
                message: "Please input Brief!",
              },
            ]}
            required
          >
            <TextArea autoSize={true} />
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
