import { Form, Input, message, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import {
  useCreateClassMutation,
  useUpdateClassMutation,
} from "../../redux/classes/classAPI";
import { useSelector } from "react-redux";
const { Option } = Select;

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsEditModal: Dispatch<SetStateAction<boolean>>;
  isEditModal?: boolean;
  loadQuery?: any;
  editData: any;
  setEditData: Dispatch<SetStateAction<any>>;
};

const ClassModal: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  isEditModal,
  loadQuery,
  setIsEditModal,
  editData,
  setEditData,
}) => {
  const { user } = useSelector((state: any) => state.auth);

  
  const [messageApi, contextHolder] = message.useMessage();

  const [addClass, { isLoading, data, error, isSuccess, isError }] =
    useCreateClassMutation();


  const [
    updateClass,
    {
      isLoading: updateLoading,
      data: updateData,
      error: updateError,
      isSuccess: updateIssuccess,
      isError: updateIsError,
    },
  ] = useUpdateClassMutation();
  const [form] = Form.useForm();

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: any) => {
    if (isEditModal) {
      await updateClass({ ...values, key: editData?.key,semester: values.semester,Session:values.Session });
      setIsEditModal(false);
      setEditData({});
    } else {
      await addClass({ ...values,semester: values.semester,Session: values.Session });
    }
    loadQuery({});
  };

  useEffect(() => {
    if (isEditModal && editData) {
      form.setFieldsValue({
        name: editData?.name,
        section: editData?.section,
        description: editData?.description,
      });
    }
  }, [editData, form, isEditModal]);
  useEffect(() => {
    if (isSuccess || updateIssuccess) {
      const message = data?.message || updateData?.message || "";
      messageApi.open({
        type: "success",
        content: message,
      });
      form.resetFields();
      setIsModalOpen(false);
    }
    if (isError || updateIsError) {
      const errordata: any = error || updateError;
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
    updateIssuccess,
    updateIsError,
    updateData,
    updateError,
  ]);

 
  return (
    <>
      {contextHolder}
      <Modal
        title={isEditModal ? "Update Class Record" : "Add Class"}
        open={isModalOpen}
        onOk={handleOk}
        okText={isEditModal ? "Update" : "Submit"}
        onCancel={handleCancel}
        okButtonProps={{
          loading: isLoading || updateLoading,
          disabled: isLoading || updateLoading,
        }}
        cancelButtonProps={{ disabled: isLoading || updateLoading }}
        centered >


        <div className="my-4 text-center">
          {`Pleas fill following fields to ${
            isEditModal ? "update" : "add"
          } class`}
        </div>
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          className="mx-auto max-w-sm">

            
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please Enter Class Name" }]} >
            <Input placeholder="Class Name *" />
          </Form.Item>

          {/* <Form.Item
            name="Session"
            rules={[{ required: true, message: "Please Enter Session" }]} >
            <Input placeholder="Session *" />
          </Form.Item> */}
          

          <Form.Item
            name="semester"
            rules={[{ required: true, message: "Please Select a Semester" }]} >
            <Select placeholder="semester *" allowClear>
              <Option value="semester_1">Semester 1</Option>
              <Option value="semester_2">Semester 2</Option>
              <Option value="semester_3">Semester 3</Option>
              <Option value="semester_4">Semester 4</Option>
              <Option value="semester_5">Semester 5</Option>
              <Option value="semester_6">Semester 6</Option>
              <Option value="semester_7">Semester 7</Option>
              <Option value="semester_8">Semester 8</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description">
            <TextArea placeholder="Description" rows={6} />
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
};

export default ClassModal;
