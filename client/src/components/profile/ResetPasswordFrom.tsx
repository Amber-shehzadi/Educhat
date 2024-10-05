import { Button, Col, Divider, Form, Input, Row, message } from "antd";
import React, { useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useUpdateUserPasswordMutation } from "../../redux/user/userAPI";

interface updatePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordFrom = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [updatePassword, { isLoading, error, isSuccess }] =
    useUpdateUserPasswordMutation();
  const onFinish = async (values: updatePassword) => {
    const { confirmPassword, ...rest } = values;
    await updatePassword(rest);
  };

  useEffect(() => {
    if (isSuccess) {
      const message = "Password updated successfully";
      messageApi.open({
        type: "success",
        content: message,
      });
      form.resetFields();
    }
    if (error) {
      if ("data" in error) {
        const errordata: any = error;
        messageApi.open({
          type: "error",
          content: errordata.data.message,
        });
      }
    }
  }, [isSuccess, error, messageApi, form]);

  return (
    <>
      {contextHolder}
      <div className="max-w-xs mx-auto">
        <h1 className="text-2xl text-balance font-medium">Reset Password</h1>
        <Divider />
        <Form onFinish={onFinish} form={form}>
          <Form.Item
            name="oldPassword"
            rules={[
              {
                required: true,
                message: "Please input your old password!",
              },
            ]}
          >
            <Input.Password
              className="rounded-full"
              placeholder="Old Password"
              size="large"
              iconRender={(visible) => (visible ? <FaEye /> : <FaEyeSlash />)}
            />
          </Form.Item>
          <Form.Item
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Please input new password!",
              },
              { min: 8, message: "Password must be 8 characters long" },
            ]}
          >
            <Input.Password
              className="rounded-full"
              placeholder="New Password"
              size="large"
              iconRender={(visible) => (visible ? <FaEye /> : <FaEyeSlash />)}
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please input confirm password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords does not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              className="rounded-full"
              placeholder="Confirm New Password"
              size="large"
              iconRender={(visible) => (visible ? <FaEye /> : <FaEyeSlash />)}
            />
          </Form.Item>
          <Form.Item>
            <Row justify="end">
              <Col>
                <Button className="custom-button ml-auto"
                  htmlType="submit"
                  size="large"
                  shape="round"
                  loading={isLoading}
                  disabled={isLoading} >
                  
                  {isLoading ? "Updating ..." : "Update"}
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default ResetPasswordFrom;
