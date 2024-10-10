"use client";
import {
  Badge,
  Button,
  Card,
  Form,
  Input,
  Layout,
  Typography,
  message,
} from "antd";
import { useEffect } from "react";

import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/features/auth/authAPI";
import { GrBold } from "react-icons/gr";

const { Title } = Typography;
const { Content } = Layout;

const Login = () => {
  const navigate = useNavigate();
  const [login, { data, isLoading, error, isSuccess }] = useLoginMutation();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    login({ email, password });
  };

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Logged in successfull";
      messageApi.open({
        type: "success",
        content: message,
      });
      form.resetFields();
      navigate("/");
    }
    if (error) {
      if ("data" in error) {
        const errordata = error as any;
        messageApi.open({
          type: "error",
          content: errordata.data.message,
        });
      }
    }
  }, [isSuccess, error, data, messageApi, form]);
  return (
    <>
      {contextHolder}
      <div className="mt-16 mx-auto sm:max-w-md pb-16 ">
        <Content className="sm:p-0 p-4">
          <div className="mb-4">
            <div className="content">
              <Title>Log In</Title>
              <p className="text-lg text-gray-500">
                Enter your Information to Login.
              </p>
            </div>
          </div>
          <Badge.Ribbon text={<strong>"Students First Priority"</strong>} color="#4b0082" >
            <Card className="h-full shadow-lg" title={<h5>🎉 Welcome to EduChat!</h5>}>
              <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                form={form}
                className="row-col"
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input
                    className="rounded-full"
                    placeholder="Email"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                    { min: 8, message: "Password must be 8 characters long" },
                  ]}
                >
                  <Input.Password
                    className="rounded-full"
                    placeholder="Password"
                    size="large"
                    iconRender={(visible) =>
                      visible ? <FaEye /> : <FaEyeSlash />
                    }
                  />
                </Form.Item>

                <Form.Item>
                <Button className="custom-button w-full"
                    htmlType="submit"
                    size="large"
                    shape="round"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in ..." : <strong>Log In</strong>}
                  </Button>
                </Form.Item>
              </Form>
              <p className="font-semibold text-muted text-center">
                😊 New to EduChat?{" "}
                <Link to="/signup" className="font-bold text-dark">
                  Register
                </Link>
              </p>
            </Card>
          </Badge.Ribbon>
        </Content>
      </div>
    </>
  );
};

export default Login;
