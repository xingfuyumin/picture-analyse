import { message, Select, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import './table.less';

const Option = Select.Option;
const request = (window as any).request;

const DataTable = () => {
  const [type, setType] = useState('mfdcca');
  const [{
    columns, dataSource,
  }, setTable] = useState({ columns: [] as any[], dataSource: [] as Record<string, string>[] });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    request('file/readFile', `table-${type}.txt`).then((content: string) => {
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
    <div className="table-container">
      <Spin spinning={loading}>
        <div className="table-header">
          <div className="table-title">特征表示:</div>
          <div className="table-oper">
            <Select value={type} onChange={(v) => setType(v)}>
              <Option key="mfdcca" value="mfdcca">基于MFDCCA的子空间特征</Option>
              <Option key="lmfdcca" value="lmfdcca">基于LMFDCCA的子空间特征</Option>
            </Select>
          </div>
        </div>
        <div className="table-content">
          <Table
            columns={columns}
            dataSource={dataSource}
            bordered
            pagination={false}
            size="small"
            scroll={{
              x: '100%',
              y: 500,
            }}
          />
        </div>
      </Spin>
    </div>
  );
};

export default DataTable;