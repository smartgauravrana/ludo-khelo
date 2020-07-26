import React from "react";
import { Table } from "antd";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import "./DisplayTable.scss";

export default function DisplayTable({
  dataSource,
  rowKey,
  columns,
  paginationProps,
  loading
}) {
  const location = useLocation();
  console.log("location: ", location);
  return (
    <div className="DisplayTable">
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          defaultCurrent: location.search.split("?page=").pop() || 1,
          defaultPageSize: 10,
          ...paginationProps
        }}
        loading={loading}
        rowKey={rowKey}
      />
    </div>
  );
}

DisplayTable.propTypes = {
  dataSource: PropTypes.array,
  columns: PropTypes.array,
  paginationProps: PropTypes.object,
  loading: PropTypes.bool,
  rowKey: PropTypes.string
};
