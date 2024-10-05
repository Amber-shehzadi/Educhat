import React, { FC } from "react";
import { Button, Form, Input, Modal } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const PollingModal: FC<Props> = ({ isModalOpen, setIsModalOpen }) => {
  const [form] = Form.useForm();

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };
  const handleSubmit = () => {
    form.submit();
  };
  const onFinish = (values: any) => {
    console.log(values, "values");
  };
  return (
    <Modal
      centered
      open={isModalOpen}
      onOk={() => handleSubmit()}
      onCancel={() => setIsModalOpen(false)}
      title={
        <h1>
          Create New Poll
          <small className="text-red-500">&nbsp;(Add at least 2 answers)</small>
        </h1>
      }
    >
      <Form form={form} {...formItemLayoutWithOutLabel} onFinish={onFinish}>
        <Form.Item
          name="pollQuestion"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Please add a polling question.",
            },
          ]}
        >
          <Input placeholder="Add Question" style={{ width: "60%" }} />
        </Form.Item>
        <Form.List
          name="answers"
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 2) {
                  return Promise.reject(
                    new Error("At least 2 answers are required")
                  );
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  //   {...(index === 0
                  //     ? formItemLayout
                  //     : formItemLayoutWithOutLabel)}
                  //   label={index === 0 ? "Answers" : ""}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please input an answer or delete this field.",
                      },
                    ]}
                    noStyle
                  >
                    <Input placeholder="Poll answer" style={{ width: "60%" }} />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button ml-2"
                      onClick={() => remove(field.name)}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Button className="custom-button"
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: "60%" }}
                  icon={<PlusOutlined />}
                >
                  Add Answer
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default PollingModal;
