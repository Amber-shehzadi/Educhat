import { DatePicker, Form, Input, message, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import moment from "moment";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import {
  useCreateTodoMutation,
  useUpdateTodoMutation,
} from "../../redux/todos/todoAPI";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsEditModal: Dispatch<SetStateAction<boolean>>;
  isEditModal?: boolean;
  loadQuery?: any;
  editData: any;
  setEditData: Dispatch<SetStateAction<any>>;
  dateClicked?: any;
  fromCalendar?: true;
};

const TodoModal: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  isEditModal,
  loadQuery,
  setIsEditModal,
  editData,
  setEditData,
  dateClicked,
  fromCalendar,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [createTodo, { isLoading, data, isError, error, isSuccess }] =
    useCreateTodoMutation();

  const [
    updateTodo,
    {
      isLoading: updateLoading,
      isError: updateIsError,
      error: updateError,
      isSuccess: updateIsSuccess,
      data: updateData,
    },
  ] = useUpdateTodoMutation();
  const [form] = Form.useForm();

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: any) => {
    if (isEditModal) {
      await updateTodo({
        id: editData?._id,
        ...values,
      });
    } else {
      await createTodo({
        ...values,
      });
    }

    loadQuery({});
  };

  useEffect(() => {
    if (isEditModal && editData) {
      form.setFieldsValue({
        title: editData?.title,
        description: editData?.description,
        startDate: dayjs(editData?.startDate),
        endDate: dayjs(editData?.endDate),
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
      form.resetFields();
      setIsModalOpen(false);
      !fromCalendar && setIsEditModal(false);
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
      !fromCalendar && setEditData({});
      !fromCalendar && setIsEditModal(false);
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
  ]);

  return (
    <>
      {contextHolder}
      <Modal
        title={isEditModal ? "Update Todo" : "Add Todo"}
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
          } Todo`}
        </div>
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          className="mx-auto max-w-sm"
          initialValues={{
            startDate: dateClicked
              ? dayjs(dateClicked).format("HH:mm") === "00:00"
                ? dayjs(dateClicked).add(
                    dayjs().diff(dayjs().startOf("day"), "minute"),
                    "m"
                  )
                : dayjs(dateClicked)
              : dayjs(),
            endDate: dateClicked
              ? dayjs(dateClicked).format("HH:mm") === "00:00"
                ? dayjs(dateClicked).add(
                    dayjs().diff(dayjs().startOf("day"), "minute") + 60,
                    "m"
                  )
                : dayjs(dateClicked).add(60, "m")
              : dayjs().add(1, "h"),
          }}
        >
          <Form.Item
            name="title"
            rules={[{ required: true, message: "Please Enter Todo Title" }]}
          >
            <Input placeholder="Title *" />
          </Form.Item>
          <Form.Item name="description">
            <TextArea placeholder="Description" rows={6} />
          </Form.Item>
          <div className="flex items-center gap-4">
            <Form.Item
              name="startDate"
              rules={[{ required: true, message: "Please Enter start date" }]}
            >
              <DatePicker
                showTime
                format={"YYYY-MM-DD hh:mm A"}
                placeholder="Start Date *"
              />
            </Form.Item>
            <Form.Item
              name="endDate"
              rules={[{ required: true, message: "Please Enter end date" }]}
            >
              <DatePicker
                showTime
                format={"YYYY-MM-DD hh:mm A"}
                placeholder="End Date *"
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default TodoModal;
