import React, { useMemo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import TableScrollPagination from './TableScrollPagination';
import { Table, Modal } from 'antd';
import VisitLog from './VisitLog';

function getTableColumn(onContactClick) {
  return [
    {
      title: '联系人',
      dataIndex: 'Contact',
      key: 'Contact',
      render(text, record, index) {
        return <span onClick={onContactClick(record)}>{text}</span>;
      },
    },
    {
      title: '客户公司',
      dataIndex: 'Company',
      key: 'Company',
      render(text, record, index) {
        return <span>{text}</span>;
      },
    },
    {
      title: '客户部门',
      dataIndex: 'Department',
      key: 'Department',
      render(text, record, index) {
        return <span>{text}</span>;
      },
    },
    {
      title: '邀请人',
      dataIndex: 'Invitee',
      key: 'Invitee',
      render(text, record, index) {
        return <span>{text}</span>;
      },
    },
  ];
}

function TableReg(props) {
  const [typeList, setTypeList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const getData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            Contact: '李白',
            Company: '李白洗衣服',
            Department: '李白洗衣粉部门',
            Invitee: '重来',
          },
        ]);
      }, 2000);
    });
  };
  const getDataParams = {};
  const processData = (res) => {
    return [res];
  };

  const fetchType = () => {
    setTypeList([]);
  };

  const onContactClick = useCallback((item) => {
    return () => {
      setCurrentItem(item);
      setShowModal(true);
    };
  }, []);

  const tableColumn = useMemo(() => {
    return getTableColumn(onContactClick);
  }, [onContactClick]);

  const onModalClose = () => {
    setCurrentItem(null);
    setShowModal(false);
  };

  useEffect(() => {
    fetchType();
  }, []);

  return (
    <>
      <TableScrollPagination
        tableID="my-table"
        rowKey={'Contact'}
        tableColumn={tableColumn}
        getData={getData}
        getDataParams={getDataParams}
        processData={processData}
        deps={[]}
      />
      <Modal
        width={'60%'}
        title="访问记录"
        visible={showModal}
        maskClosable={false}
        footer={null}
        onCancel={onModalClose}
        bodyStyle={{
          paddingTop: 0,
        }}
      >
        <VisitLog />
      </Modal>
    </>
  );
}

TableReg.propTypes = {};

export default TableReg;
