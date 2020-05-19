import React from "react";
import { Table } from "antd";
import PropTypes from "prop-types";

import "./DisplayTable.scss";

export default function DisplayTable({
  dataSource,
  rowKey,
  columns,
  paginationProps,
  loading
}) {
  return (
    <div className="Table">
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={paginationProps}
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
