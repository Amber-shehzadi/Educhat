import { Button, Divider, Form, Input, message, Modal, Select } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAddCommentMutation } from "../../redux/todos/todoAPI";
const { Option } = Select;

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  loadQuery?: any;
  viewData: any;
};

const ViewTodoModal: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  loadQuery,
  viewData,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [addComment, { isLoading, data, error, isError, isSuccess }] =
    useAddCommentMutation();
  const [form] = Form.useForm();

  const [comments, setComments] = useState(viewData?.comments);
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: any) => {
    await addComment({ id: viewData?._id, ...values });
  };

  useEffect(() => {
    if (viewData?.comments) {
      setComments(viewData.comments);
    }
  }, [viewData]);
  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      setComments(data?.comments);
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
        title={"Todo Information"}
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        centered
      >
        <div className="w-full my-4">
          <div className="flex items-center justify-start gap-2 my-2">
            <h1 className=" text-gray-800 font-semibold">Title:</h1>
            <p className="truncate capitalize">{viewData?.title}</p>
          </div>
          <div className="flex items-center justify-start gap-2 my-2">
            <h1 className=" text-gray-800 font-semibold">Status:</h1>
            <p className="truncate capitalize">{viewData?.status}</p>
          </div>
          <div className="flex items-center justify-start gap-2 my-2">
            <h1 className=" text-gray-800 font-semibold">Description:</h1>
            <p className="truncate">{viewData?.description}</p>
          </div>
          <div className="flex items-center justify-start gap-2 my-2">
            <h1 className=" text-gray-800 font-semibold ">Start Date:</h1>
            <p className="truncate">
              {moment(viewData?.startDate).format("MMMM Do YYYY, h:mm:ss a")}
            </p>
          </div>
          <div className="flex items-center justify-start gap-2 my-2">
            <h1 className=" text-gray-800 font-semibold">End Date:</h1>
            <p className="truncate">
              {moment(viewData?.endDate).format("MMMM Do YYYY, h:mm:ss a")}
            </p>
          </div>
        </div>
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          className="mx-auto "
        >
          <Form.Item
            name="commentText"
            rules={[{ required: true, message: "Please write comment" }]}
          >
            <Input placeholder="Comment *" />
          </Form.Item>
          <Form.Item>
            <Button className="custom-button"
              htmlType="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              Add Comment
            </Button>
          </Form.Item>
        </Form>
        <div className="mb-4 text-lg text-gray-600 font-semibold">
          Comments:
        </div>
        <div className="flex flex-col max-h-[200px] overflow-y-auto">
          {comments?.length ? (
            comments?.map((el: any, idx: number) => (
              <React.Fragment key={idx}>
                <div className="flex  justify-between text-gray-500 gap-4">
                  <h1> {el?.commentText}</h1>
                  <small className="font-semibold">
                    {dayjs(el?.createdAt).format("D MMM  YYYY h:mm A")}
                  </small>
                </div>
                <Divider className="m-0 my-2" />
              </React.Fragment>
            ))
          ) : (
            <div className="text-gray-500 gap-4 text-center">No Comments</div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ViewTodoModal;
