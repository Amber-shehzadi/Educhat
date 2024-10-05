import { Table } from "antd";
import React from "react";

type Props = {
  data: any[];
  isLoading: boolean;
  columns: any[];
};

const DataTable: React.FC<Props> = ({ data, isLoading, columns }) => (
  <div style={{ overflowX: "auto", overflowY: "hidden" }}>
    <Table
      columns={columns}
      dataSource={data}
      scroll={{ x: "max-content", y: 300 }}
      loading={isLoading}
    />
  </div>
);

export default DataTable;
