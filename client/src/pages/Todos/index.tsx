import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  List,
  MenuProps,
  message,
  Popconfirm,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import TodoModal from "../../components/Todos/TodoModal";
import {
  useDeleteTodoMutation,
  useLazyGetUserTodosQuery,
  useUpdateTodoStatusMutation,
} from "../../redux/todos/todoAPI";
import ViewTodoModal from "../../components/Todos/ViewTodoModal";
import { todoStatus } from "../../constants/data";

const Todos: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [
    getUserTodos,
    { isLoading, error, isSuccess, isError, data: todoData },
  ] = useLazyGetUserTodosQuery();

  const [updateTodoStatus, { isLoading: updateLoading }] =
    useUpdateTodoStatusMutation();

  const [deleteTodo, { isLoading: deleteLoading }] = useDeleteTodoMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModal, setIsViewModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editData, setEditData] = useState({} as any);
  const [data, setData] = useState([] as any);
  const [modalData, setModalData] = useState({} as any);

  useEffect(() => {
    getUserTodos({});
  }, [getUserTodos]);

  useEffect(() => {
    if (isSuccess) {
      setData(todoData?.todos);
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
  }, [isSuccess, error, data, messageApi, isError, todoData]);

  const handleOnStatusChnaged = async (key: string, id: string) => {
    const { data } = await updateTodoStatus({ id, status: key });
    console.log(data, "data1", key);
    if (data?.status) {
      messageApi.open({
        type: "success",
        content: "Status has been updated successfully",
      });
      await getUserTodos({});
    } else {
      messageApi.open({
        type: "error",
        content: "Something went wrong please try again",
      });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    const { data } = await deleteTodo({ id });
    console.log(data, "data1");
    if (data?.status) {
      messageApi.open({
        type: "success",
        content: "Todo has been deleted  successfully",
      });
      await getUserTodos({});
    } else {
      messageApi.open({
        type: "error",
        content: "Something went wrong please try again",
      });
    }
  };

  const handleEditTodo = (data: any) => {
    setEditData(data);
    setIsEditModal(true);
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (viewData: any) => {
    setModalData(viewData);
    setIsViewModal(true);
  };
  return (
    <>
      {contextHolder}
      <div className="p-4">
        <div className="my-4 flex items-center justify-between">
          <div className="text-gray-600 text-2xl font-bold">Todo List</div>
          <Button className="custom-button inline-flex items-center justify-center min-w-[100px] max-w-full px-4 py-2 bg-indigo-600 text-white border border-indigo-600 transition-all duration-300 hover:bg-indigo-700 focus:outline-none"
            shape="round"
            icon={<FaPlus />}
            onClick={() => setIsModalOpen(true)}
          >
            New Todo
          </Button>
        </div>
        <div className="flex items-center justify-end w-full my-4"></div>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            lg: 3,
          }}
          dataSource={data}
          loading={isLoading || updateLoading || deleteLoading}
          renderItem={(item: any) => {
            return (
              <List.Item>
                <Card
                  // onClick={() => handleOpenViewModal(item)}
                  title={item?.title}
                  hoverable
                  className="max-w-xs"
                  actions={[
                    <EditOutlined
                      key="edit"
                      onClick={() => handleEditTodo(item)}
                    />,
                    <Popconfirm
                      title="Delete the task"
                      description="Are you sure to delete this task?"
                      onConfirm={() => handleDeleteTodo(item?._id as string)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined key="delete" />
                    </Popconfirm>,
                    <EyeOutlined
                      key="view"
                      onClick={() => handleOpenViewModal(item)}
                    />,
                    <Dropdown
                      menu={{
                        items: todoStatus,
                        onClick: ({ key }) =>
                          handleOnStatusChnaged(key, item?._id as string),
                        selectedKeys: [item?.status as string],
                      }}
                      trigger={["click"]}
                      key="ellipsis"
                    >
                      <EllipsisOutlined />
                    </Dropdown>,
                  ]}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">Status:</h1>
                      <p className="truncate capitalize">{item?.status}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">
                        Description:
                      </h1>
                      <p className="truncate">{item?.description}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold ">
                        Start Date:
                      </h1>
                      <p className="truncate">
                        {moment(item?.startDate).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">
                        End Date:
                      </h1>
                      <p className="truncate">
                        {moment(item?.endDate).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </p>
                    </div>
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
      {isViewModal && (
        <ViewTodoModal
          isModalOpen={isViewModal}
          setIsModalOpen={setIsViewModal}
          viewData={modalData}
          loadQuery={getUserTodos}
        />
      )}
      {isModalOpen && (
        <TodoModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          isEditModal={isEditModal}
          setIsEditModal={setIsEditModal}
          editData={editData}
          setEditData={setEditData}
          loadQuery={getUserTodos}
        />
      )}
    </>
  );
};

export default Todos;
