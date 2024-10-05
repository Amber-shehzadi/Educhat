import { Layout, theme } from "antd";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Header";
import Sidebar from "./Siderbar";
import socketIO from "socket.io-client";

const ENDPOINT = import.meta.env.VITE_SOCKET_ENDPOINT || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const { Content } = Layout;
const LayoutPage: React.FC<any> = ({ user }) => {
  const location = useLocation();
  const endPoint = location.pathname;
  const isChat = endPoint.includes("chat");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Navbar user={user} />
      <Layout>
        <Sidebar />

        <Content className={isChat ? "" : "my-6 ml-4 mr-4 md:mr-0"}>
          <div
            style={{
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
