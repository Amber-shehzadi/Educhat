"use client";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Button, Form, Input, Modal, message } from "antd";

import { useSelector } from "react-redux";
import { useActivationMutation } from "../../redux/features/auth/authAPI";
import { Link } from "react-router-dom";

type OTPmodalProps = {
  openModal: boolean;
  setOpenModal: any;
};

const OTPmodal: FC<OTPmodalProps> = ({ openModal, setOpenModal }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [otpStatus, setOtpStatus] = useState(false);
  const { token } = useSelector((state: any) => state.auth);
  const [activation, { isSuccess, error, isLoading }] = useActivationMutation();
  const [form] = Form.useForm();
  useEffect(() => {
    if (isSuccess) {
      setOpenModal(false);
      form.resetFields();

      messageApi.open({
        type: "success",
        content: "Account activated successfully",
      });
    }
    if (error) {
      if ("data" in error) {
        const errordata = error as any;
        setOtpStatus(true);
        messageApi.open({
          type: "error",
          content: errordata.data.message,
        });
      } else {
        console.error("An error occured :", error);
      }
    }
  }, [isSuccess, error, messageApi, setOpenModal, form]);
  const onFinish = async (values: any) => {
    await activation({
      activation_token: token,
      activation_code: values.activation_code,
    });
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={openModal}
        footer={false}
        closeIcon={false}
        className="min-w-fit"
      >
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-center ">
            Verify your Account
          </h1>
          
          <img
            src="/profileAvatar/verifyotp.jpg"
            height={200}
            width={200}
            alt={"verify otp image"}
            />

          <div className="flex justify-center items-center">
            <Form form={form} onFinish={onFinish}>
              <Form.Item
                name="activation_code"
                rules={[
                  {
                    required: true,
                    message: "Please enter the OTP.",
                  },
                  {
                    pattern: /^[0-9]{4}$/,
                    message: "Please enter only numbers in OTP.",
                  },
                ]}
              >
                <Input.OTP
                  length={4}
                  size="large"
                  status={otpStatus ? "error" : ""}
                />
              </Form.Item>
              <Form.Item>
                <Button className="custom-button w-full"
                  htmlType="submit"
                  size="large"
                  shape="round"
                  loading={isLoading}
                  disabled={isLoading}
                > <strong>Verify</strong>
                </Button>
              </Form.Item>
            </Form>
          </div>
          <p className="text-center">
            Go back to log in ? &nbsp;
            <Link to="/login" className="font-medium">
              Log In
            </Link>
          </p>
        </div>
      </Modal>
    </>
  );
};

export default OTPmodal;
