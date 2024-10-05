import { Form, Input, message, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import {
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from "../../redux/announcements/announcementAPI";
import { useSocket } from "../../context/SocketContext";
import { useSelector } from "react-redux";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsEditModal: Dispatch<SetStateAction<boolean>>;
  isEditModal?: boolean;
  loadQuery?: any;
  editData: any;
  setEditData: Dispatch<SetStateAction<any>>;
};

const AnnouncementModal: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  isEditModal,
  loadQuery,
  setIsEditModal,
  editData,
  setEditData,
}) => {
  const { socket } = useSocket();
  const { user } = useSelector((state: any) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();

  const [createAnnouncement, { isLoading, data, isError, error, isSuccess }] =
    useCreateAnnouncementMutation();

  const [
    updateAnnouncement,
    {
      isLoading: updateLoading,
      isError: updateIsError,
      error: updateError,
      isSuccess: updateIsSuccess,
      data: updateData,
    },
  ] = useUpdateAnnouncementMutation();
  const [form] = Form.useForm();

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditModal(false);
  };

  const onFinish = async (values: any) => {
    if (isEditModal) {
      await updateAnnouncement({
        id: editData?._id,
        ...values,
      });
    } else {
      await socket?.emit("createAnnouncement", {
        ...values,
        createdBy: user?._id,
      });
      form.resetFields();
      setIsModalOpen(false);
    }
    loadQuery();
  };

  useEffect(() => {
    if (isEditModal && editData) {
      form.setFieldsValue({
        title: editData?.title,
        description: editData?.description,
      });
    }
  }, [editData, form, isEditModal]);

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "";
      messageApi.open({
        type: "success",
        content: message,
      });
      // loadQuery();
      form.resetFields();
      setIsModalOpen(false);
      setIsEditModal(false);
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
    loadQuery,
  ]);

  useEffect(() => {
    if (updateIsSuccess) {
      const message = updateData?.message || "";
      messageApi.open({
        type: "success",
        content: message,
      });
      form.resetFields();
      // loadQuery();
      setIsModalOpen(false);
      setEditData({});
      setIsEditModal(false);
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
    setEditData,
    setIsEditModal,
    loadQuery,
  ]);

  return (
    <>
      {contextHolder}
      <Modal
        title={isEditModal ? "Update Announcement" : "Add Announcement"}
        open={isModalOpen}
        onOk={handleOk}
        okText={isEditModal ? "Update" : "Create"}
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
            isEditModal ? "update" : "create"
          } announcement`}
        </div>
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          className="mx-auto max-w-sm"
          //   initialValues={{
          //     startDate: moment(),
          //     endDate: moment(),
          //   }}
        >
          <Form.Item
            name="title"
            rules={[
              { required: true, message: "Please Enter Announcement Title" },
            ]}
          >
            <Input placeholder="Title *" />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[
              {
                required: true,
                message: "Please Enter Announcement Description",
              },
            ]}
          >
            <TextArea placeholder="Description" rows={6} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AnnouncementModal;
