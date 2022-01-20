import { ArrowLeftOutlined, ArrowRightOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, message, Select, Table } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import './table.less';

const Option = Select.Option;
const request = (window as any).request;

type Props = {
  next: () => void;
  last: () => void;
  first: () => void;
  setLoading: (loading: boolean) => void;
}

const DataTable: FC<Props> = ({
  next, last, first, setLoading,
}) => {
  const [type, setType] = useState('mfdcca');
  const [{
    columns, dataSource,
  }, setTable] = useState({ columns: [] as any[], dataSource: [] as Record<string, string>[] });
  useEffect(() => {
    setLoading(true);
    request('file/readFile', `tmp/table-${type}.txt`).then((content: string) => {
      const arr: Record<string, string>[] = [];
      const columns: any[] = [];
      content.split('\n').forEach((str: string, x: number) => {
        if (str) {
          const obj: Record<string, string> = {};
          str.split('	').forEach((s: string, i: number) => {
            obj[`data${i}`] = s;
            obj.key = String(x);
            if (!columns[i]) {
              columns[i] = {
                dataIndex: `data${i}`,
                title: String(i + 1),
                width: 160,
              };
            }
          })
          arr.push(obj);
        }
      });
      setTable({
        dataSource: arr,
        columns,
      });
      setLoading(false);
    }).catch((err: string | Error) => {
      message.error(err);
      setLoading(false);
    });
  }, [type]);
  return (

    <div className="dir-select table-container">
      <div className="header">
        <Select value={type} onChange={(v) => setType(v)}>
          <Option key="mfdcca" value="mfdcca">基于MFDCCA的子空间特征</Option>
          <Option key="lmfdcca" value="lmfdcca">基于LMFDCCA的子空间特征</Option>
        </Select>
      </div>
      <div className="content">
        <Table
          columns={columns}
          dataSource={dataSource}
          bordered
          pagination={false}
          size="small"
          scroll={{
            x: columns.length * 160,
            y: 'calc(100% - 36px)',
          }}
        />
      </div>
      <div className="footer">
      <Button
          onClick={first}
        >
          <HomeOutlined />首页
        </Button>
        <Button
          onClick={last}
        >
          <ArrowLeftOutlined />上一步
        </Button>
        <Button
          type="primary"
          onClick={next}
        >
          下一步<ArrowRightOutlined />
        </Button>
      </div>
    </div>
  );
};

export default DataTable;