import {
  Avatar,
  Divider,
  message,
  Popconfirm,
  PopconfirmProps,
  Popover,
} from "antd";
import dayjs from "dayjs";
import React, { FC, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { assignAvaatr, getAvatarname, getDuration } from "../../utils/common";
import { useSelector } from "react-redux";
import EventModal from "../events/EventModal";
import { useDeleteUserEventMutation } from "../../redux/events/eventAPI";

type Props = {
  eventInfo: any;
  queryLoad: () => Promise<void> | null;
};
const EventModel: FC<Props> = ({ eventInfo, queryLoad }) => {
  const editData = {
    title: eventInfo?._def?.title,
    description: eventInfo?._def?.extendedProps?.description,
    startDate: eventInfo?.start,
    endDate: eventInfo?.end || eventInfo?.start,
    allDay: eventInfo?._def?.allDay,
    id: eventInfo?._def?.extendedProps?._id,
  };

  const [deleteEvent, { isLoading, error, isError, data, isSuccess }] =
    useDeleteUserEventMutation();
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
    await deleteEvent({ id: eventInfo?._def?.extendedProps?._id });
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
  };

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
  }, [isSuccess, error, data, messageApi, isError]);
  return (
    <>
      {contextHolder}
      <Popover
        // open={openPopover}
        content={
          <div className="flex max-w-xs flex-col justify-start gap-2">
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
            <p className="text-gray-700/90 font-bold">Event Information</p>
            {(user?.role === "admin" || user?.role === "coordinator") && (
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
                  <FaTrash
                    color="#555555"
                    size={12}
                    className="cursor-pointer"
                  />
                </Popconfirm>
              </div>
            )}
          </div>
        }
        trigger="click"
      >
        <div
          className="p-1 bg-purple-900/60 w-full rounded-sm flex items-center justify-between"
          onClick={() => setOpenPopover(true)}
        >
          <div className="text-white font-medium truncate">
            {eventInfo?._def?.title}
          </div>
        </div>
      </Popover>
      {openEventModal && (
        <EventModal
          isModalOpen={openEventModal}
          setIsModalOpen={setOpenEventModal}
          loadQuery={queryLoad}
          isEditModal={true}
          editData={editData}
        />
      )}
    </>
  );
};

export default EventModel;
