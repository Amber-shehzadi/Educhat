"use client";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Drawer,
  Dropdown,
  Input,
  Layout,
  MenuProps,
  Switch,
  Tooltip,
  message,
  theme,
} from "antd";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaRegBell, FaVideo } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { getAvatarname } from "../../utils/common";
import { useLazyLogoutQuery } from "../../redux/features/auth/authAPI";
import { useAppStore } from "../../store";
import { useLazyGetUserNotificationsQuery } from "../../redux/notifications/notificationAPI";
import VideoCall from "../Video-call";
import dayjs from "dayjs";

const Navbar = ({ user }: any) => {
  const {
    // @ts-expect-error state
    userNotifications,
    // @ts-expect-error state
    setUserNotifications,
  } = useAppStore();
  const [getuserNotifications] = useLazyGetUserNotificationsQuery();
  const navigate = useNavigate();
  const { Header } = Layout;
  const { token } = theme.useToken();
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [count, setCount] = useState(0);

  const [logout, { isLoading, error, isSuccess, data }] = useLazyLogoutQuery();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Logged out successfull";
      messageApi.open({
        type: "success",
        content: message,
      });
      navigate("/");
    }
    if (error) {
      if ("data" in error) {
        const errordata = error as any;
        messageApi.open({
          type: "error",
          content: errordata.data.message,
        });
      }
    }
  }, [isSuccess, error, data, messageApi, navigate]);

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: "none",
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    await logout({}).unwrap();
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const AuthItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link to={"/profile"}>
          <div className="flex items-center  gap-2">
            <UserOutlined />
            Manage Account
          </div>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <div
          className="flex items-center gap-2  text-red-600 "
          onClick={handleLogout}
        >
          {isLoading ? <LoadingOutlined /> : <FiLogOut />}
          {isLoading ? "Logging out ..." : "Logout"}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const handleGetUserNotifications = async () => {
      const { data } = await getuserNotifications({});
      console.log(data, "notification");
      setUserNotifications(data?.notifications);
      setCount(data?.count);
    };
    handleGetUserNotifications();
  }, [getuserNotifications, setUserNotifications]);

  return (
    <>
      {contextHolder}
      <Header
        style={{ padding: 0, background: colorBgContainer }}
        className="sticky top-0 w-100 z-50 shadow-md"
      >
        <div className="shadow-sm h-full flex items-center justify-between px-8">
          <Link className="text-bold text-purple-950 !hover:text" to="/">
            <strong>EDU CHAT</strong>
          </Link>
          <div className="flex items-center gap-6">
            {/* <Input
              className="sm:inline-flex hidden rounded-full"
              placeholder="Search"
              suffix={
                <Tooltip title="Search something">
                  <FaSearch style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            /> */}
            {user?.role !== "student" && (
              <Link to={"/video-room"} target="_blank">
                <Button
                  icon={<FaVideo />}
                  onClick={() => <VideoCall />}
                  shape="circle"
                />
              </Link>
            )}
            <Badge count={count} size="small" offset={[-10, 10]}>
              <div
                className="p-2 rounded-full hover:bg-gray-200 cursor-pointer transition-all delay-75"
                onClick={showDrawer}
              >
                <FaRegBell size={22} fill={open ? "#000" : ""} />
              </div>
            </Badge>
            <Dropdown
              menu={{ items: AuthItems }}
              arrow
              trigger={["click"]}
              dropdownRender={(menu) => (
                <div style={contentStyle}>
                  <div className="p-4 flex flex-col gap-4">
                    <h1 className="sm:text-base text-lg text-black/90 text-balance font-medium">
                      Account
                    </h1>
                    <div className="flex items-center gap-2">
                      <Avatar size={"large"} src={user?.avatar?.url}>
                        {getAvatarname(user?.name || "")}
                      </Avatar>
                      <div>
                        <h2 className="text-base text-black/75">
                          {user?.name ?? "User name"}
                        </h2>
                        <p className="text-sm text-black/50">
                          {user?.email ?? "User email"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Divider style={{ margin: 0 }} />

                  {React.cloneElement(menu as React.ReactElement, {
                    style: menuStyle,
                  })}
                </div>
              )}
            >
              <div className="cursor-pointer">
                <Avatar size={"large"} src={user?.avatar?.url}>
                  {getAvatarname(user?.name || "")}
                </Avatar>
              </div>
            </Dropdown>
          </div>
        </div>
        <Drawer title="All Notifications" onClose={onClose} open={open}>
          <div className="flex flex-col items-center justify-between sm:flex-row  gap-4">
            <h1 className="sm:text-xl text-2xl text-black/90 text-balance font-semibold">
              Notifications
            </h1>
            {/* <div className="flex justify-center items-center gap-2">
              <p>Only show unread</p>
              <Switch defaultChecked size="small" />
            </div> */}
          </div>
          <Divider />
          {userNotifications?.length
            ? userNotifications?.map((el: any, idx: number) => (
                <>
                  <div
                    className="flex flex-col w-full justify-between items-start"
                    key={idx}
                  >
                    {el?.message}
                    <small className="text-slate-400">
                      {dayjs(el?.createdAt)?.format("MMM D, YYYY h:mm A")}
                    </small>
                  </div>
                  <Divider />
                </>
              ))
            : "No any notification"}
        </Drawer>
      </Header>
    </>
  );
};

export default Navbar;
