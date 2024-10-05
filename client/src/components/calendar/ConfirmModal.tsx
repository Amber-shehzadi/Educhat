import { Button, DatePicker, Form, Input, message, Modal, Switch } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  useCreateEventMutation,
  useUpdateUserEventMutation,
} from "../../redux/events/eventAPI";
import { FcTodoList } from "react-icons/fc";
import { MdOutlineEvent } from "react-icons/md";
import { useSelector } from "react-redux";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setOpenEventModal: Dispatch<SetStateAction<boolean>>;
  setOpenTodoModal: Dispatch<SetStateAction<boolean>>;
};
const ConfirmModal: FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  setOpenEventModal,
  setOpenTodoModal,
}) => {
  const { user } = useSelector((state: any) => state.auth);
  const isFacultyOrAdmin = user?.role === "coordinator" || user?.role === "admin";

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title={"Select Calendar Element"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <div className="my-4 text-center">Please click on your choice</div>
        <div className="flex flex-col items-center justify-center gap-4">
          {isFacultyOrAdmin && (
            <Button
              className="w-full text-lg font-medium custom-button"
              shape="round"
              icon={<MdOutlineEvent />}
              onClick={() => {
                setOpenEventModal(true);
                setIsModalOpen(false);
              }}
            >
              Add Event
            </Button>
          )}

          <Button
            className="w-full text-lg font-medium"
            shape="round"
            icon={<FcTodoList />}
            onClick={() => {
              setOpenTodoModal(true);
              setIsModalOpen(false);
            }}
          >
            Add Todo
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmModal;
