import { Button, DatePicker, Dropdown, Menu, Switch } from "antd";
import dayjs from "dayjs";
import { FC, useCallback, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { HiOutlineAdjustments } from "react-icons/hi";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { calendarFilterOption, viewList } from "../../constants/data";
type Props = {
  selectedDate: dayjs.Dayjs;
  setSelectedDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
  calendarRef: any;
  setActiveView: any;
  activeView: any;
  incompleted: boolean;
  setInCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  filterOption: string;
  setFilterOption: React.Dispatch<React.SetStateAction<string>>;
};
const TopHeader: FC<Props> = ({
  selectedDate,
  setSelectedDate,
  calendarRef,
  setActiveView,
  activeView,
  incompleted,
  setInCompleted,
  filterOption,
  setFilterOption,
}) => {
  const [openCalendar, setOpenCalendar] = useState(false);

  const onDateChange = (date: any) => {
    const currentDate = dayjs(date).format("YYYY-MM-DD");
    calendarRef.current?.getApi().gotoDate(currentDate);
    setSelectedDate(dayjs(date));
    setOpenCalendar(false); // Close the calendar after selecting a date
  };

  const changeTitle = useCallback(
    (calRef: any) => {
      if (calRef === undefined) {
        setSelectedDate(dayjs());
      } else {
        setSelectedDate(dayjs(calRef.current.getApi().getDate()));
      }
    },
    [setSelectedDate]
  );

  const handlePrevClick = () => {
    calendarRef.current.getApi().prev();
    changeTitle(calendarRef);
  };

  const handleNextClick = () => {
    calendarRef.current.getApi().next();
    changeTitle(calendarRef);
  };

  const handleClickToday = () => {
    const currentDate = dayjs().format("YYYY-MM-DD");
    calendarRef.current?.getApi().gotoDate(currentDate);
    setSelectedDate(dayjs());
  };

  const onChangeViewClick = (view: any) => {
    setActiveView(view);
    calendarRef.current.getApi().changeView(view.type);
  };

  return (
    <div className="sticky bg-white flex justify-between items-center z-10 top-16 shadow-md p-4">
      <div className="flex items-center justify-center gap-6">
        <div className="relative flex items-center justify-center gap-4 text-gray-600">
          <FaAngleLeft
            className="cursor-pointer"
            size={20}
            onClick={handlePrevClick}
          />
          <div
            className=" font-bold text-xl cursor-pointer "
            onClick={() => setOpenCalendar(true)}
          >
            {dayjs(selectedDate).format("MMMM YYYY")}
          </div>
          <FaAngleRight
            className="cursor-pointer"
            size={20}
            onClick={handleNextClick}
          />
          {openCalendar && (
            <div className="absolute top-4 z-20">
              <DatePicker
                value={selectedDate}
                open
                className="headerDatePicker"
                onChange={onDateChange}
              />
            </div>
          )}
        </div>
        <Button className="custom-button" onClick={handleClickToday}>
          Today
        </Button>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Dropdown
          className="calendar-view-dropdown"
          overlay={
            <Menu className="calendar-view-dropdown-list">
              {viewList.map((view, index) => {
                return (
                  <Menu.Item
                    onClick={() => onChangeViewClick(view)}
                    key={index}
                  >
                    {view.name}
                  </Menu.Item>
                );
              })}
            </Menu>
          }
          trigger={["click"]}
        >
          <Button shape="round">
            {activeView.name}
            <MdOutlineArrowDropDown />
          </Button>
        </Dropdown>
        <div className="assignment-complete flex items-center justify-center gap-2">
          <label htmlFor="assignment-complete">Incomplete</label>
          <Switch value={incompleted} onChange={(e) => setInCompleted(e)} />
        </div>
        <Dropdown
          menu={{
            items: calendarFilterOption,
            onClick: ({ key }) => setFilterOption(key),
            selectedKeys: [filterOption],
          }}
          trigger={["click"]}
          key="ellipsis"
        >
          <HiOutlineAdjustments
            className="rotate-90 cursor-pointer"
            size={24}
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default TopHeader;
