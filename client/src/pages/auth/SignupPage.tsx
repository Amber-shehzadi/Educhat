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
import { useEffect, useState } from "react";

import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useRegisterMutation } from "../../redux/features/auth/authAPI";
import OTPmodal from "../../components/auth/OTPmodal";

const { Title } = Typography;
const { Content } = Layout;

const SignUp = () => {
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [registerUser, { isLoading, data, isSuccess, error, isError }] =
    useRegisterMutation();
  const onFinish = async (values: any) => {
    const data = { ...values };
    await registerUser(data);
  };

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Registration successfull";
      messageApi.open({
        type: "success",
        content: message,
      });
      form.resetFields();
      setOpenModal(true);
    }
    if (isError) {
      if ("data" in error) {
        const errordata: any = error;
        messageApi.open({
          type: "error",
          content: errordata.data.message,
        });
      }
    }
  }, [isSuccess, error, data, messageApi, isError, form]);
  return (
    <>
      {contextHolder}
      <div className="mt-16 mx-auto sm:max-w-md pb-16 ">
        <Content className="sm:p-0 p-4">
          <div className="mb-4">
            <div className="content">
              <Title>Sign Up</Title>
              <p className="text-lg text-gray-500">
                Enter your Information to Register
              </p>
            </div>
          </div>
          <Badge.Ribbon text={<strong>"Students First Priority"</strong>} color="#4b0082" >
          <Card className="h-full shadow-lg" title={<h5>📝 Register Your Account</h5>}>
          <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                form={form}
                className="row-col"
              >
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your username!",
                    },
                  ]}
                >
                  <Input
                    className="rounded-full"
                    placeholder="Name"
                    size="large"
                  />
                </Form.Item>


                <Form.Item
                  name="fatherName"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Father's name!",
                    },
                  ]}
                >
                  <Input
                    className="rounded-full"
                    placeholder="Fathername"
                    size="large"
                  />
                </Form.Item>



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
                    className="rounded-full custom-input "
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
                    {isLoading ? "Signing up..." : <strong>Sign Up</strong>}
                  </Button>
                </Form.Item>
              </Form>
              <p className="font-semibold text-muted text-center">
                🙌 Already have an account?{" "}
                <Link to="/login" className="font-bold text-dark">
                  Login
                </Link>
              </p>
            </Card>
          </Badge.Ribbon>
        </Content>
      </div>
      {openModal && (
        <OTPmodal openModal={openModal} setOpenModal={setOpenModal} />
      )}
    </>
  );
};

export default SignUp;
