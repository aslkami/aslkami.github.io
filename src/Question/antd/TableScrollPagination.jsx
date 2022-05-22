import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

function TableScrollPagination(props) {
  const {
    tableID,
    tableColumn,
    rowKey,
    initialPageSize,
    deps,
    getData,
    getDataParams,
    processData,
    ...restProps
  } = props;
  const [tableData, setTableData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const tableRef = useRef(null);

  const fetchData = () => {
    getData({
      ...getDataParams,
      pageNo,
      pageSize,
    })
      .then((result) => {
        const [data, error] = processData(result);
        if (error) {
          throw new Error(error);
        }
        setTableData(data);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  useEffect(() => {
    if (!tableRef.current) {
      tableRef.current = document.querySelectorAll(`#${tableID} .ant-table-body`)[0];
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [pageNo]);

  useEffect(() => {
    setPageNo(1);
  }, deps);

  const onScrollCapture = (e) => {
    if (!tableRef.current) return false;
  };

  console.log(tableData, tableColumn);

  return (
    <div onScrollCapture={onScrollCapture}>
      <Table
        {...restProps}
        id={tableID}
        dataSource={tableData}
        columns={tableColumn}
        rowKey={rowKey}
        pagination={false}
        sticky
      />
    </div>
  );
}

TableScrollPagination.defaultProps = {
  tableColumn: [],
  initialPageSize: 30,
  threshold: 80,
};

TableScrollPagination.propTypes = {
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  deps: PropTypes.array,
  tableID: PropTypes.string,
  getData: PropTypes.func,
  getDataParams: PropTypes.object,
  processData: PropTypes.func,
  threshold: PropTypes.number,
};

export default TableScrollPagination;
