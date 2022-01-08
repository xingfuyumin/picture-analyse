import { InputNumber, message, Select, Spin } from 'antd';
import React, { useEffect, useState, useRef, FC } from 'react';
import { Config } from '../type';
import './chart.less';
import * as echarts from 'echarts';
import 'echarts-gl';

const Option = Select.Option;
const request = (window as any).request;
type Props = {
  path: string;
  config: Config;
};

const DataChart: FC<Props> = ({ config, path }) => {
  const [type, setType] = useState('mfdcca');
  const [number, setNumber] = useState(0);
  const [list, setList] = useState([] as any[]);
  const [info, setInfo] = useState({} as any);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const chartRef = useRef(null as any);
  const refreshData = () => {
    request('file/readFile', 'chart-info.json').then((content: string) => {
      setInfo(JSON.parse(content));
      request('file/readFile', 'chart-data.txt').then((content: string) => {
        const arr:any[] = [];
        const columns: any[] = [];
        content.split('\n').forEach((str: string, x: number) => {
          if (str) {
            arr.push(str.split('	').slice(0, 3));
          }
        });
        setList(arr);
        setLoading(false);
      }).catch((err: string | Error) => {
        message.error(err);
        setLoading(false);
      });
    }).catch((err: string | Error) => {
      message.error(err);
      setInfo({});
      setLoading(false);
    });
  };
  const sendCommand = () => {
    if (config.cmd2) {
      setLoading(true);
      request('command/shell', `${config.cmd2} ${path} ${type} ${number}`).then(() => {
        refreshData();
      }).catch((err: string | Error) => {
        message.error(err);
        setLoading(false);
      });
    } else {
      refreshData();
    }
  }
  useEffect(refreshData, [1]);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (!chartRef.current) {
      chartRef.current = echarts.init(ref.current, 'dark');
    }
    const option = {
      tooltip: {},
      xAxis3D: {
        name: 'x',
        type: 'value'
      },
      yAxis3D: {
        name: 'y',
        type: 'value'
      },
      zAxis3D: {
        name: 'z',
        type: 'value'
      },
      grid3D: {
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        axisPointer: {
          lineStyle: {
            color: '#ffbd67'
          }
        }
      },
      series: [
        {
          type: 'scatter3D',
          dimensions: ['x', 'y', 'z'],
          data: list,
          symbolSize: 12,
          itemStyle: {
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.8)'
          },
          emphasis: {
            itemStyle: {
              color: '#fff'
            }
          }
        }
      ]
    };
    chartRef.current.setOption(option);
    
  }, [list, ref.current]);
  return (
    <div className="chart-container">
      <Spin spinning={loading}>
        <div className="chart-header">
          <div className="chart-title">聚类分析:</div>
          <div className="chart-oper">
            <Select value={type} onChange={(v) => setType(v)} onSelect={sendCommand}>
              <Option key="mfdcca" value="mfdcca">基于MFDCCA的子空间特征</Option>
              <Option key="lmfdcca" value="lmfdcca">基于LMFDCCA的子空间特征</Option>
            </Select>
            <span>簇数量：</span>
            <InputNumber
              value={number}
              onBlur={sendCommand}
              onPressEnter={sendCommand}
              onChange={(v) => setNumber(v)}
            />
          </div>
        </div>
        <div className="chart-content">
          <div className="chart-top">
            评价指标：&emsp;ACC={info.acc}&emsp;MINI={info.mini}&emsp;F={info.f}&emsp;RI={info.ri}
          </div>
          <div className="chart-bottom" ref={ref} />
        </div>
      </Spin>
    </div>
  );
};

export default DataChart;