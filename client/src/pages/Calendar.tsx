import { EventContentArg, EventDropArg } from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  EventResizeDoneArg,
} from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { message, Spin } from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";
import EventModel from "../components/calendar/EventModel";
import TopHeader from "../components/calendar/TopHeader";
import EventModal from "../components/events/EventModal";
import {
  useDrageUserEventMutation,
  useLazyGetUserEventsQuery,
} from "../redux/events/eventAPI";
import {
  useDrageUserTodoMutation,
  useLazyGetUserCalendarTodosQuery,
  useLazyGetUserTodosQuery,
} from "../redux/todos/todoAPI";
import TodoModel from "./Todos/TodoModel";
import TodoModal from "../components/Todos/TodoModal";
import ConfirmModal from "../components/calendar/ConfirmModal";
import { RiTruckLine } from "react-icons/ri";
// import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";

const calendarProps = {
  droppable: true,
  views: {
    dayGridMonth: {
      // name of view
      dayMaxEvents: 3,
      // other view-specific options here
    },
    dayGridWeek: {
      dayMaxEvents: false,
    },
  },
  height: "auto",
  editable: true,
  nextDayThreshold: "00:00:00",
  // schedulerLicenseKey,
  plugins: [
    dayGridPlugin,
    interactionPlugin,
    listPlugin,
    timeGridPlugin,
    // resourceTimeGridPlugin,
  ],
};
export default function Calendar() {
  const [getUserTodos, { isLoading: todoLoading }] =
    useLazyGetUserCalendarTodosQuery();
  const [getUserEvents, { isLoading }] = useLazyGetUserEventsQuery();
  const [
    updateDrgagResizeEvent,
    { isLoading: dragLoading, isSuccess, data, error, isError },
  ] = useDrageUserEventMutation();

  const [
    updateDrgagResizeTodo,
    {
      isLoading: todoDragLoading,
      isSuccess: todoSuccess,
      data: todoData,
      error: todoError,
      isError: todoIsError,
    },
  ] = useDrageUserTodoMutation();
  const [messageApi, contextHolder] = message.useMessage();

  const calendarRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [openEventModal, setOpenEventModal] = useState(false);
  const [openTodoModal, setOpenTodoModal] = useState(false);
  const [openSelectionModal, setOpenSelectionModal] = useState(false);
  const [dateClicked, setDateClicked] = useState();
  const [calEvents, setCalEvents] = useState<any[]>([]);
  const [showInComplete, setShowInCompleted] = useState(false);
  const [filterOption, setFilterOption] = useState("all");

  const [activeView, setActiveView] = useState({
    name: "Monthly",
    type: "dayGridMonth",
    oldName: "month",
  });

  const handleDateClick = (dateInfo: any) => {
    setDateClicked(dateInfo?.dateStr);
    setOpenSelectionModal(true);
  };
  const getCalendarEvents = useCallback(async () => {
    const start = dayjs(selectedDate).subtract(15, "days").toISOString();
    const end = dayjs(selectedDate).add(15, "days").toISOString();
    const { data } = await getUserEvents({ start, end });
    const { data: todoData } = await getUserTodos({ start, end });
    if (showInComplete) {
      const incompletedTodos = todoData?.todos?.length
        ? todoData?.todos?.filter((todo: any) => todo.status !== "completed")
        : [];
      if (filterOption === "todo") {
        setCalEvents([...(incompletedTodos || [])]);
      } else if (filterOption === "event") {
        setCalEvents(data?.events);
      } else {
        return setCalEvents([
          ...(data?.events || []),
          ...(incompletedTodos || []),
        ]);
      }
    } else {
      if (filterOption === "todo") {
        setCalEvents([...(todoData?.todos || [])]);
      } else if (filterOption === "event") {
        setCalEvents(data?.events);
      } else {
        return setCalEvents([
          ...(data?.events || []),
          ...(todoData?.todos || []),
        ]);
      }
    }
  }, [selectedDate, getUserEvents, getUserTodos, showInComplete, filterOption]);

  useEffect(() => {
    getCalendarEvents();
  }, [showInComplete, filterOption]);

  const CalElements = (eventInfo: EventContentArg) => {
    const eventProps = eventInfo.event;
    console.log(eventProps, "eventprops");
    if (eventProps?._def?.extendedProps?.model === "event") {
      return (
        <EventModel eventInfo={eventProps} queryLoad={getCalendarEvents} />
      );
    }
    if (eventProps?._def?.extendedProps?.model === "todo") {
      console.log("andr");
      return <TodoModel eventInfo={eventProps} queryLoad={getCalendarEvents} />;
    }
  };

  const handleEventResize = async (info: EventResizeDoneArg) => {
    const { event } = info;
    if (event?._def?.extendedProps?.model === "event") {
      await updateDrgagResizeEvent({
        id: event?._def?.extendedProps?._id,
        startDate: event?.start,
        endDate: event?.end || event?.start,
        allDay: event?._def?.allDay,
      });
    } else if (event?._def?.extendedProps?.model === "todo") {
      await updateDrgagResizeTodo({
        id: event?._def?.extendedProps?._id,
        startDate: event?.start,
        endDate: event?.end || event?.start,
      });
    }
  };

  const handleEventDrop = async (info: EventDropArg) => {
    const { event } = info;
    console.log(event, "event");

    if (event?._def?.extendedProps?.model === "event") {
      await updateDrgagResizeEvent({
        id: event?._def?.extendedProps?._id,
        startDate: event?.start,
        endDate: event?.end || event?.start,
        allDay: event?._def?.allDay,
      });
    } else if (event?._def?.extendedProps?.model === "todo") {
      await updateDrgagResizeTodo({
        id: event?._def?.extendedProps?._id,
        startDate: event?.start,
        endDate: event?.end || event?.start,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "";
      messageApi.open({
        type: "success",
        content: message,
      });
      getCalendarEvents();
    }
    if (isError) {
      const errordata: any = error;
      messageApi.open({
        type: "error",
        content: errordata.data.message,
      });
    }
  }, [isSuccess, error, data, messageApi, isError, getCalendarEvents]);

  useEffect(() => {
    if (todoSuccess) {
      const message = todoData?.message || "";
      messageApi.open({
        type: "success",
        content: message,
      });
      getCalendarEvents();
    }
    if (todoIsError) {
      const errordata: any = todoError;
      messageApi.open({
        type: "error",
        content: errordata.data.message,
      });
    }
  }, [
    todoSuccess,
    todoError,
    todoData,
    messageApi,
    todoIsError,
    getCalendarEvents,
  ]);

  console.log(calEvents, "events");
  return (
    <>
      {contextHolder}
      <TopHeader
        incompleted={showInComplete}
        setInCompleted={setShowInCompleted}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        calendarRef={calendarRef}
        activeView={activeView}
        setActiveView={setActiveView}
        filterOption={filterOption}
        setFilterOption={setFilterOption}
      />
      <Spin
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999999999999,
        }}
        size="large"
        spinning={isLoading || dragLoading || todoLoading}
      >
        <FullCalendar
          ref={calendarRef}
          events={calEvents}
          {...calendarProps}
          headerToolbar={false}
          dateClick={handleDateClick}
          eventContent={CalElements}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
        />
      </Spin>
      {openEventModal && (
        <EventModal
          isModalOpen={openEventModal}
          setIsModalOpen={setOpenEventModal}
          dateClicked={dateClicked}
          loadQuery={getCalendarEvents}
          selectedDate={selectedDate}
        />
      )}
      {openTodoModal && (
        // @ts-expect-error state
        <TodoModal
          isModalOpen={openTodoModal}
          setIsModalOpen={setOpenTodoModal}
          dateClicked={dateClicked}
          loadQuery={getCalendarEvents}
          isEditModal={false}
          fromCalendar={true}
        />
      )}
      {openSelectionModal && (
        <ConfirmModal
          isModalOpen={openSelectionModal}
          setIsModalOpen={setOpenSelectionModal}
          setOpenEventModal={setOpenEventModal}
          setOpenTodoModal={setOpenTodoModal}
        />
      )}
    </>
  );
}
