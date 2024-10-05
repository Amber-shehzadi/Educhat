import { Button, Form, Input, message, Modal, Radio, Select } from "antd";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useCreateTeacherStudentMutation } from "../../redux/user/userAPI";
import Upload, { RcFile, UploadChangeParam } from "antd/es/upload";
import { PlusOutlined } from "@ant-design/icons";
import { useLazyGetAllClassesQuery } from "../../redux/classes/classAPI";
const { Option } = Select;

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsEditModal: Dispatch<SetStateAction<boolean>>;
  isEditModal?: boolean;
  loadQuery?: any;
  editData: any;
  setEditData: Dispatch<SetStateAction<any>>;
  isStudentModal: boolean;
};

const MAX_FILE_COUNT = 1;
const MAX_TOTAL_SIZE_MB = 5;

const TeacherStudentModal: FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  isEditModal,
  loadQuery,
  setIsEditModal,
  editData,
  setEditData,
  isStudentModal,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [createTeacherStudent, { isLoading, data, isError, error, isSuccess }] =
    useCreateTeacherStudentMutation();

  const [getAllClasses, { isLoading: classLoading }] =
    useLazyGetAllClassesQuery();

  const [classesData, setClassesData] = useState([] as any);

  const [files, setFiles] = useState<any[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  const handleFileListChange = (fileList: RcFile[]) => {
    const totalSize = fileList.reduce((sum, file) => sum + file.size, 0);

    // Validate files
    const errors: string[] = [];
    if (fileList.length > MAX_FILE_COUNT) {
      errors.push(`You can only upload up to ${MAX_FILE_COUNT} files.`);
    }
    if (totalSize > MAX_TOTAL_SIZE_MB * 1024 * 1024) {
      errors.push(
        `The total file size should not exceed ${MAX_TOTAL_SIZE_MB}MB.`
      );
    }

    if (errors.length > 0) {
      setFileErrors(errors);
      console.log(errors, "error");
      // message.error(errors.join(' '));
      return;
    }
    setFiles(fileList);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: any) => {
    if (!values?.avatar) {
      return await createTeacherStudent({ ...values });
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(values?.avatar?.file);
    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result;
        createTeacherStudent({ ...values, avatar });
      }
    };
    // console.log({ ...values, avatar }, "test");
  };

  const handelGetClasses = async () => {
    const { data } = await getAllClasses({});
    if (data?.status) {
      setClassesData(data?.classes);
    }
    console.log(data, "data");
  };
  useEffect(() => {
    handelGetClasses();
  }, []);
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

  const props = {
    name: "file",
    multiple: true,
    fileList: files,
    beforeUpload(file: RcFile) {
      // Prevent automatic upload
      return false;
    },
    onChange(info: UploadChangeParam<any>) {
      // Update file list with the current files
      handleFileListChange(info.fileList as RcFile[]);
    },
    onDrop(e: React.DragEvent<HTMLDivElement>) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  return (
    <>
      {contextHolder}
      <Modal
        title={isEditModal ? "Update User Record" : "Add User"}
        open={isModalOpen}
        onOk={handleOk}
        okText={isEditModal ? "Update" : "Submit"}
        onCancel={handleCancel}
        okButtonProps={{
          loading: isLoading,
          disabled: isLoading,
        }}
        cancelButtonProps={{ disabled: isLoading }}
        centered >
        <div className="my-4 text-center">
          {`Pleas fill following fields to ${
            isEditModal ? "update" : "add"
          } data`}
        </div>
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          className="mx-auto max-w-sm"
          initialValues={{
            gender: "male",
            role: isStudentModal ? "student" : "teacher",
          }}>
          <Form.Item name="avatar">
            <Upload listType="picture-card" {...props}>
              {files?.length >= 1 ? null : (
                <button style={{ width: "100%",
                  backgroundColor: "#4b0082", // Set your desired background color
                  color: "#ffffff", // Set the text color (white in this example)
                  borderColor: "#4b0082", // Set the border color to match the background
                  border: 0,
                   background: "none"
                 }}
                  type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            name="reg_no"
            rules={[
              {
                required: true,
                message: "Please input registration number!",
              },
            ]}
          >
            <Input placeholder="Registration Number * " />
          </Form.Item>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input name!",
              },
            ]}
          >
            <Input placeholder="Name * " />
          </Form.Item>
          <Form.Item
            name="address"
            rules={[
              {
                required: true,
                message: "Please input address!",
              },
            ]}
          >
            <Input placeholder="Address * " />
          </Form.Item>
          <Form.Item
            name="contact"
            rules={[
              {
                required: true,
                message: "Please input contcat!",
              },
            ]}
          >
            <Input placeholder="Contact * " />
          </Form.Item>
          <Form.Item
            name="cnic"
            rules={[
              {
                required: true,
                message: "Please input cnic!",
              },
            ]}
          >
            <Input placeholder="CNIC * " />
          </Form.Item>
          <Form.Item
            name="gender"
            rules={[
              {
                required: true,
                message: "Please select gender",
              },
            ]}
          >
            <Radio.Group>
              <Radio value={"male"}>Male</Radio>
              <Radio value={"female"}>Female</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="classId"
            rules={[
              {
                required: true,
                message: "Please select class!",
              },
            ]}
          >
            <Select
              placeholder="Class *"
              showSearch
              allowClear
              loading={classLoading}
              optionFilterProp="label"
            >
              {classesData?.length
                ? classesData.map((el: any, idx: number) => (
                    <Option
                      value={el?.key}
                      key={idx}
                      label={`${el?.name} ${el?.semester}`}
                    >
                      {`${el?.name}    (${el?.semester})`}
                    </Option>
                  ))
                : null}
            </Select>
          </Form.Item>
          <Form.Item
            name="role"
            rules={[
              {
                required: true,
                message: "Please select role!",
              },
            ]}
          >
            <Radio.Group>
              <Radio value={"teacher"}>Teacher</Radio>
              <Radio value={"student"}>Student</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input email!" }]}
          >
            <Input placeholder="Email *" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
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

export default TeacherStudentModal;
