import { EllipsisOutlined } from "@ant-design/icons";
import {
  Avatar,
  Divider,
  Dropdown,
  message,
  Popconfirm,
  PopconfirmProps,
  Popover,
} from "antd";
import dayjs from "dayjs";
import { FC, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useSelector } from "react-redux";
import TodoModal from "../../components/Todos/TodoModal";
import { todoStatus } from "../../constants/data";
import {
  useDeleteTodoMutation,
  useUpdateTodoStatusMutation,
} from "../../redux/todos/todoAPI";
import { assignAvaatr, getAvatarname, getDuration } from "../../utils/common";

type Props = {
  eventInfo: any;
  queryLoad: () => Promise<void> | null;
};
const TodoModel: FC<Props> = ({ eventInfo, queryLoad }) => {
  const editData = {
    title: eventInfo?._def?.title,
    description: eventInfo?._def?.extendedProps?.description,
    startDate: eventInfo?.start,
    endDate: eventInfo?.end || eventInfo?.start,
    _id: eventInfo?._def?.extendedProps?._id,
  };

  const [deleteTodo, { isLoading, error, isError, data, isSuccess }] =
    useDeleteTodoMutation();
  const [messageApi, contextHolder] = message.useMessage();

  const { user } = useSelector((state: any) => state.auth);
  const [openEventModal, setOpenEventModal] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);

  console.log(eventInfo);
  const handleOpenEditModal = () => {
    setOpenPopover(false);
    setOpenEventModal(true);
  };

  const confirm: PopconfirmProps["onConfirm"] = async (e) => {
    await deleteTodo({ id: eventInfo?._def?.extendedProps?._id });
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
  };

  console.log(editData, "editdata");
  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "";
      messageApi.open({
        type: "success",
        content: message,
      });
      queryLoad();
    }
    if (isError) {
      const errordata: any = error;
      messageApi.open({
        type: "error",
        content: errordata.data.message,
      });
    }
  }, [isSuccess, error, data, messageApi, isError, queryLoad]);

  const [updateTodoStatus, { isLoading: updateLoading }] =
    useUpdateTodoStatusMutation();

  const handleOnStatusChnaged = async (key: string, id: string) => {
    const { data } = await updateTodoStatus({ id, status: key });
    console.log(data, "data1", key);
    if (data?.status) {
      messageApi.open({
        type: "success",
        content: "Status has been updated successfully",
      });
      await queryLoad();
    } else {
      messageApi.open({
        type: "error",
        content: "Something went wrong please try again",
      });
    }
  };
  return (
    <>
      {contextHolder}
      <Popover
        // open={openPopover}
        content={
          <div className="flex max-w-xs flex-col justify-start gap-2">
            <div className="text-gray-600 font-medium">
              <strong>Title:</strong> {eventInfo?._def?.title}
            </div>
            <div className="text-gray-600 font-medium">
              <strong>Status:</strong> {eventInfo?._def?.extendedProps?.status}
            </div>
            <div className="text-gray-600">{eventInfo?._def?.title}</div>
            <div className="text-gray-600">
              <strong>From :</strong>
              {eventInfo?._def?.allDay
                ? dayjs(eventInfo?.start).format("D MMM YYYY")
                : dayjs(eventInfo?.start).format("D MMM YYYY h:mm A")}
            </div>
            {eventInfo?.end && (
              <div className="text-gray-600">
                <strong>To :</strong>
                {eventInfo?._def?.allDay
                  ? dayjs(eventInfo?.end).format("D MMM YYYY")
                  : dayjs(eventInfo?.end).format("D MMM YYYY h:mm A")}
              </div>
            )}
            <div className="text-gray-600">
              <strong>Duration :</strong>
              {eventInfo?._def?.allDay
                ? "All Day"
                : getDuration(eventInfo?.start, eventInfo?.end)}
            </div>
            <Divider className="my-2" />

            {eventInfo?._def?.extendedProps?.assignees?.length
              ? eventInfo?._def?.extendedProps?.assignees?.map(
                  (assignee: any, idx: number) => (
                    <div
                      className="flex items-center gap-2.5 max-w-full w-full overflow-hidden cursor-pointer relative group"
                      key={idx}
                    >
                      <Avatar
                        src={
                          assignee?.avatar?.url ||
                          assignAvaatr(assignee?.gender)
                        }
                        size="large"
                        className="flex-shrink-0"
                      >
                        {getAvatarname(assignee?.name || "Unknow User")}
                      </Avatar>
                      <div className="flex flex-col flex-grow overflow-hidden">
                        <div className="flex justify-between items-center">
                          <h1 className="text-gray-600 font-medium">
                            {assignee?.name}
                          </h1>
                        </div>
                        <small className="truncate text-xs text-gray-500 whitespace-nowrap overflow-hidden font-semibold">
                          {assignee?.email}
                        </small>
                      </div>
                    </div>
                  )
                )
              : null}
          </div>
        }
        title={
          <div className="flex items-center justify-between gap-4">
            <p className="text-gray-700/90 font-bold">Todo Information</p>

            <div className="flex items-center justify-center gap-2">
              <FaPencil
                color="#555555"
                size={12}
                className="cursor-pointer"
                onClick={handleOpenEditModal}
              />
              <Popconfirm
                title="Delete the event"
                description="Are you sure to delete this event?"
                onConfirm={confirm}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <FaTrash color="#555555" size={12} className="cursor-pointer" />
              </Popconfirm>
              <Dropdown
                menu={{
                  items: todoStatus,
                  onClick: ({ key }) =>
                    handleOnStatusChnaged(
                      key,
                      eventInfo?._def?.extendedProps?._id as string
                    ),
                  selectedKeys: [
                    eventInfo?._def?.extendedProps?.status as string,
                  ],
                }}
                trigger={["click"]}
                key="ellipsis"
              >
                <EllipsisOutlined />
              </Dropdown>
            </div>
          </div>
        }
        trigger="click"
      >
        <div
          className={`p-1  w-full rounded-sm flex items-center justify-between ${
            updateLoading ? "bg-green-400/30" : "bg-green-500/60"
          }`}
          onClick={() => setOpenPopover(true)}
        >
          <div className="text-white font-medium truncate">
            {eventInfo?._def?.title}
          </div>

          <div className="text-white font-medium truncate"></div>
          {/* <div className="flex flex-col items-center justify-center">
            <small>{dayjs(eventInfo?.start).format("D MMM YYYY h:mm A")}</small>
            <small>{dayjs(eventInfo?.end).format("D MMM YYYY h:mm A")}</small>
          </div> */}
        </div>
      </Popover>
      {openEventModal && (
        //@ts-expect-error state
        <TodoModal
          isModalOpen={openEventModal}
          setIsModalOpen={setOpenEventModal}
          loadQuery={queryLoad}
          isEditModal={true}
          editData={editData}
          fromCalendar={true}
        />
      )}
    </>
  );
};

export default TodoModel;
