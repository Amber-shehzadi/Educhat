"use client";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, MenuProps, theme } from "antd";
import React from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { FaCalendar } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { FcTodoList } from "react-icons/fc";
import { GrAnnounce } from "react-icons/gr";
import { MdFeedback, MdOutlineClass } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const location = useLocation();
  const endPoint = location.pathname;
  const isChat = endPoint.includes("chat");
  const isCalendar = endPoint.includes("calendar");
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { user } = useSelector((state: any) => state.auth);
  const isFacultyOrAdmin = user?.role === "coordinator" || user?.role === "admin";

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      collapsed={isChat || isCalendar}
      onBreakpoint={(broken) => {
        // console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        // console.log(collapsed, type);
      }}
      style={{
        background: colorBgContainer,
      }}
    >
      <Menu mode="inline" defaultSelectedKeys={["dashboard"]}>
        <Menu.Item key="dashboard" icon={<AiOutlineDashboard />}>
          <Link to="/">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="calendar" icon={<FaCalendar />}>
          <Link to="/calendar">Calendar</Link>
        </Menu.Item>
        <Menu.Item key="messanger" icon={<BiMessageRoundedDetail />}>
          <Link to="/chat">Messanger</Link>
        </Menu.Item>

        {user && isFacultyOrAdmin ? (
          <>
            <Menu.Item key="classes" icon={<MdOutlineClass />}>
              <Link to="/classes">Manage Classes</Link>
            </Menu.Item>
            <Menu.Item key="users" icon={<FaUsers />}>
              <Link to="/users">Manage Users</Link>
            </Menu.Item>
          </>
        ) : null}
        <Menu.Item key="todos" icon={<FcTodoList />}>
          <Link to="/todos">Todo List</Link>
        </Menu.Item>
        <Menu.Item key="announcement" icon={<GrAnnounce />}>
          <Link to="/announcement">Announcements</Link>
        </Menu.Item>
        {user?.role === "student" && (
          <Menu.Item key="feedback" icon={<MdFeedback />}>
            <Link to="/feedback">Feed Back</Link>
          </Menu.Item>
        )}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
