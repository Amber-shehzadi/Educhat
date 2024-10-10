import { DatePicker, Form, Input, message, Modal, Switch } from "antd";
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

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsEditModal?: Dispatch<SetStateAction<boolean>>;
  isEditModal?: boolean;
  loadQuery: () => Promise<void> | null;
  editData?: any;
  setEditData?: Dispatch<SetStateAction<any>>;
  dateClicked?: any;
  selectedDate?: any;
};
const EventModal: FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  isEditModal,
  loadQuery,
  setIsEditModal,
  editData,
  setEditData,
  dateClicked,
  selectedDate,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [createEvent, { isLoading, data, error, isError, isSuccess }] =
    useCreateEventMutation();

  const [updateEvent, { isLoading: updateLoading }] =
    useUpdateUserEventMutation();

  const [allDay, setAllDay] = useState(false);

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: any) => {
    if (isEditModal) {
      await updateEvent({ ...values, allDay, id: editData?.id });
    } else {
      await createEvent({ ...values, allDay });
    }
    loadQuery();
  };

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "";
      messageApi.open({
        type: "success",
        content: message,
      });
      form.resetFields();
      setIsModalOpen(false);
      setAllDay(false);
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
    if (editData) {
      console.log(editData, "data");
      form.setFieldsValue({
        title: editData?.title,
        description: editData?.description,
        startDate: dayjs(editData?.startDate),
        endDate: dayjs(editData?.endDate),
      });
      setAllDay(editData?.allDay);
    }
  }, [editData, form]);
  return (
    <>
      {contextHolder}
      <Modal
        title={isEditModal ? "Update Event" : "Add Event"}
        open={isModalOpen}
        onOk={handleOk}
        okText={isEditModal ? "Update" : "Create"}
        onCancel={handleCancel}
        okButtonProps={{
          loading: isLoading,
          disabled: isLoading,
        }}
        cancelButtonProps={{ disabled: isLoading }}
        centered
      >
        <div className="my-4 text-center">
          {` Please fill up following form to ${
            isEditModal ? "update" : "create"
          } the event`}
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
          <div className="assignment-complete flex items-center justify-start gap-2 mb-2">
            <label htmlFor="assignment-complete">All Day</label>
            <Switch
              defaultChecked={false}
              size="small"
              onChange={(e) => setAllDay(e)}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Form.Item
              name="startDate"
              rules={[{ required: true, message: "Please Enter start date" }]}
            >
              <DatePicker
                showTime={!allDay}
                placeholder="Start Date *"
                format={allDay ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm A"}
                use12Hours={true}
          
              />
            </Form.Item>
            <Form.Item
              name="endDate"
              rules={[{ required: true, message: "Please Enter end date" }]}
            >
              <DatePicker
                showTime={!allDay}
                placeholder="End Date *"
                format={allDay ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm A"}
                use12Hours={true}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default EventModal;
