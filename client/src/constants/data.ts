import { MenuProps } from "antd";

export const viewList = [
  { name: "Simple View", type: "dayGridWeek", oldName: "basicWeek" },
  { name: "Daily", type: "timeGridDay", oldName: "agendaDay" },
  { name: "Weekly", type: "timeGridWeek", oldName: "agendaWeek" },
  { name: "Monthly", type: "dayGridMonth", oldName: "month" },
];

export const todoStatus: MenuProps["items"] = [
  {
    label: "Pending",
    key: "pending",
  },
  {
    label: "In Progress",
    key: "in-progress",
  },
  {
    label: "On Hold",
    key: "on-hold",
  },
  {
    label: "Completed",
    key: "completed",
  },
];
export const calendarFilterOption: MenuProps["items"] = [
  {
    label: "Todos",
    key: "todo",
  },
  {
    label: "Events",
    key: "event",
  },
  {
    label: "All",
    key: "all",
  },
];
