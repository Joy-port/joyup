import { dayRangeFromToday, getDateFromToday } from "./functions"

export const titleCommandList = [
  {
    icon: "Sun",
    name: "Start Date",
    type: "startDate",
  },
  {
    icon: "Sunset",
    name: "Due Date",
    type: "dueDate",
  },
  {
    icon: "Flag",
    name: "priority",
    type: "tag",
  },
  {
    icon: "CheckCircle",
    name: "progress",
    type: "tag",
  },
]
export const dateCommandList = [
  {
    icon: "Moon",
    name: "today",
    date: new Date().getTime(),
  },
  {
    icon: "Sun",
    name: "tomorrow",
    date: new Date(getDateFromToday(1)).getTime(),
  },
  {
    icon: "Sunrise",
    name: "this friday",
    date: new Date(getDateFromToday(dayRangeFromToday(5))).getTime(),
  },
  {
    icon: "Calendar",
    name: "next week",
    date: new Date(getDateFromToday(7)).getTime(),
  },
]
