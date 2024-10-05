import React, { useCallback, useEffect, useState } from "react";
import GridBackground from "../components/ui/GridBackground";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { useLazyGetUserCountQuery } from "../redux/user/userAPI";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const Homepage = () => {
  const [getUserCount, { isLoading: userCountLoading }] =
    useLazyGetUserCountQuery();

  // Doughnut chart data
  const [doughnutData, setDoughnutData] = useState({
    labels: ["Admins", "Coordinator", "Students", "Teachers"],
    datasets: [
      {
        label: "Active",
        data: [],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#01579b"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#01579b"],
        borderWidth: 1,
        borderRadius: 30,
        spacing: 10,
        cutout: "80%", // Adjust this value as needed
      },
    ],
  });

  // Line chart data
  const [lineData, setLineData] = useState({
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Monthly Data",
        data: [65, 59, 80, 81, 56, 45],
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: "Monthly Data",
        data: [45, 59, 30, 81, 56, 45],
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 35, 0.2)",
        fill: true,
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  });

  const getUserCountForChart = useCallback(async () => {
    const { data } = await getUserCount({});
    if (data?.success) {
      // Create a shallow copy of the usercount array and then sort it
      const sortedUserCount = data?.usercount?.length
        ? [...data.usercount]
            .sort((a, b) => a.role.localeCompare(b.role))
            .map((item) => item.count)
        : [];

      // @ts-expect-error state
      setDoughnutData((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: sortedUserCount,
          },
        ],
      }));
    }
  }, [getUserCount]);

  useEffect(() => {
    getUserCountForChart();
  }, []);

  return (
    <GridBackground>
      <div className="w-full flex flex-col items-center justify-center gap-8 p-8">
        <Row gutter={16} className="w-full">
          <Col span={8}>
            <Card bordered={false} hoverable>
              <Statistic
                title="Active"
                value={11.28}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                prefix={<ArrowUpOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} hoverable>
              <Statistic
                title="Non Active"
                value={9.3}
                precision={2}
                valueStyle={{ color: "#cf1322" }}
                prefix={<ArrowDownOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} hoverable>
              <Statistic
                title="Pending"
                value={7.5}
                precision={2}
                valueStyle={{ color: "#1890ff" }}
                prefix={<ArrowDownOutlined />}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={16} className="w-full">
          <Col span={12}>
            <Card bordered={false} hoverable>
              <Doughnut data={doughnutData} className="w-full h-full" />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false} hoverable className="w-full h-full">
              <Line data={lineData} className="w-full h-full" />
            </Card>
          </Col>
        </Row>
      </div>
    </GridBackground>
  );
};

export default Homepage;
