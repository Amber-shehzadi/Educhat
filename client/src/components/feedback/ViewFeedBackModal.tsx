import {
  Avatar,
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Select,
} from "antd";
import dayjs from "dayjs";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAddCommentMutation } from "../../redux/todos/todoAPI";
import { getAvatarname } from "../../utils/common";
import { useAddFeedbackMutation } from "../../redux/user/userAPI";
const { Option } = Select;

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  loadQuery?: any;
  viewData: any;
};

const ViewFeedBackModal: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  loadQuery,
  viewData,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [addFeedBack, { isLoading, data, error, isError, isSuccess }] =
    useAddFeedbackMutation();
  const [form] = Form.useForm();

  const [feedbacks, setFeedbacks] = useState(viewData?.feedbacks);
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: any) => {
    await addFeedBack({ teacherId: viewData?._id, ...values });
  };

  useEffect(() => {
    if (viewData?.feedbacks?.length) {
      setFeedbacks(viewData?.feedbacks);
    }
  }, [viewData]);

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      setFeedbacks(data?.teacher?.feedbacks);
      loadQuery({});
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
  }, [isSuccess, error, data, messageApi, isError, loadQuery, form]);

  return (
    <>
      {contextHolder}
      <Modal
        title={"Teacher Information for Feedback"}
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        centered
      >
        <div className="w-full my-4">
          <div className="flex items-center justify-start gap-2 my-2">
            <Avatar size={"large"} src={viewData?.avatar?.url}>
              {getAvatarname(viewData?.name || "")}
            </Avatar>
          </div>
          <div className="flex items-center justify-start gap-2 my-2">
            <h1 className=" text-gray-800 font-semibold">Name:</h1>
            <p className="truncate capitalize">{viewData?.name}</p>
          </div>
          <div className="flex items-center justify-start gap-2 my-2">
            <h1 className=" text-gray-800 font-semibold">Gender:</h1>
            <p className="truncate capitalize">{viewData?.gender}</p>
          </div>
          <div className="flex items-center justify-start gap-2 my-2">
            <h1 className=" text-gray-800 font-semibold">Email:</h1>
            <p className="truncate">{viewData?.email}</p>
          </div>
          <div className="flex items-center justify-start gap-2 my-2">
            <h1 className=" text-gray-800 font-semibold">CNIC:</h1>
            <p className="truncate">{viewData?.cnic}</p>
          </div>
          <div className="flex items-center justify-start gap-2 my-2">
            <h1 className=" text-gray-800 font-semibold">Contact:</h1>
            <p className="truncate">{viewData?.contact}</p>
          </div>
        </div>
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          className="mx-auto "
        >
          <Form.Item
            name="feedbackText"
            rules={[{ required: true, message: "Please write something" }]}
          >
            <Input placeholder="Feedback *" />
          </Form.Item>
          <Form.Item>
            <Button className="custom-button"
              htmlType="submit"
              loading={isLoading}
              disabled={isLoading} >
              Add Feedback
            </Button>
          </Form.Item>
        </Form>
        <div className="mb-4 text-lg text-gray-600 font-semibold">
          FeedBacks:
        </div>
        <div className="flex flex-col max-h-[200px] overflow-y-auto">
          {feedbacks?.length ? (
            feedbacks?.map((el: any, idx: number) => (
              <React.Fragment key={idx}>
                <div className="flex  justify-between text-gray-500 gap-4">
                  <h1> {el?.feedbackText}</h1>
                  <small className="font-semibold">
                    {dayjs(el?.date).format("D MMM  YYYY h:mm A")}
                  </small>
                </div>
                <Divider className="m-0 my-2" />
              </React.Fragment>
            ))
          ) : (
            <div className="text-gray-500 gap-4 text-center">No feedbacks</div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ViewFeedBackModal;
