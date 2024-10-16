import { Form, Input, message, Modal } from "antd";
import React, { Dispatch, FC, SetStateAction, useEffect } from "react";
import {
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
} from "../../redux/user/userAPI";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsEditModal: Dispatch<SetStateAction<boolean>>;
  isEditModal?: boolean;
  loadQuery?: any;
  editData: any;
  setEditData: Dispatch<SetStateAction<any>>;
};

const FacultyModal: FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  isEditModal,
  loadQuery,
  setIsEditModal,
  editData,
  setEditData,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [createFaculty, { isLoading, data, isError, error, isSuccess }] =
    useCreateFacultyMutation();
  const [
    updatefaculty,
    {
      isLoading: updateLoading,
      data: updateData,
      isError: updateIsError,
      error: updateError,
      isSuccess: updateIsSuccess,
    },
  ] = useUpdateFacultyMutation();

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditData({});
    setIsEditModal(false);
  };

  const onFinish = async (values: any) => {
    if (isEditModal) {
      return updatefaculty({ id: editData?._id, ...values });
    }
    return await createFaculty({ ...values });
  };

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "";
      messageApi.open({
        type: "success",
        content: message,
      });
      form.resetFields();
      setIsModalOpen(false);
      loadQuery();
    }
    if (isError) {
      const errordata: any = error;
      messageApi.open({
        type: "error",
        content: errordata.data.message,
      });
    }
  }, [
    isSuccess,
    error,
    data,
    messageApi,
    form,
    isError,
    setIsModalOpen,
    setIsEditModal,
  ]);

  useEffect(() => {
    if (updateIsSuccess) {
      const message = updateData?.message || "";
      messageApi.open({
        type: "success",
        content: message,
      });
      form.resetFields();
      setIsModalOpen(false);
      loadQuery();
    }
    if (updateIsError) {
      const errordata: any = updateError;
      messageApi.open({
        type: "error",
        content: errordata.data.message,
      });
    }
  }, [
    updateIsSuccess,
    updateError,
    updateData,
    messageApi,
    form,
    updateIsError,
    setIsModalOpen,
    setIsEditModal,
  ]);

  console.log(editData, "edit data");
  useEffect(() => {
    form.setFieldsValue({
      name: editData?.name,
      email: editData?.email,
    });
  }, [editData, form]);

  return (
    <>
      {contextHolder}
      <Modal
        title={isEditModal ? "Update Class Record" : "Add Coordinator"}
        open={isModalOpen}
        onOk={handleOk}
        okText={isEditModal ? "Update" : "Submit"}
        onCancel={handleCancel}
        okButtonProps={{
          loading: isLoading || updateLoading,
          disabled: isLoading || updateLoading,
        }}
        cancelButtonProps={{ disabled: isLoading || updateLoading }}
        centered
      >
        <div className="my-4 text-center">
          {`Pleas fill following fields to ${
            isEditModal ? "update" : "add"
          } coordinator`}
        </div>
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          className="mx-auto max-w-sm"
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input coordinator name!",
              },
            ]}
          >
            <Input placeholder="Coordinator Name * " />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input email!" }]}
          >
            <Input placeholder="Coordinator Email *" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: !isEditModal,
                message: "Please input password!",
              },
              { min: 8, message: "Password must be 8 characters long" },
            ]}
          >
            <Input.Password
              placeholder="Password *"
              iconRender={(visible) => (visible ? <FaEye /> : <FaEyeSlash />)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FacultyModal;
