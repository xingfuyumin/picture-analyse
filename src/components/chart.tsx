import { Button, InputNumber, message, Select } from 'antd';
import React, { useEffect, useState, useRef, FC } from 'react';
import { Config } from '../type';
import './chart.less';
import * as echarts from 'echarts';
import 'echarts-gl';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const Option = Select.Option;
const request = (window as any).request;
type Props = {
  config: Config;
  last: () => void;
  first: () => void;
  setLoading: (loading: boolean) => void;
};

const DataChart: FC<Props> = ({
  config,
  last, first, setLoading,
}) => {
  const [type, setType] = useState('mfdcca');
  const [number, setNumber] = useState(0);
  const [list, setList] = useState([] as any[][]);
  const [info, setInfo] = useState({} as any);
  const ref = useRef(null);
  const chartRef = useRef(null as any);
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      Promise.all([request('file/readFile', 'tmp/chart-info.json'),
      request('file/readFile', 'tmp/chart-data.txt')]).then(([t1, t2]) => {
        setInfo(JSON.parse(t1));
        const arr: any[] = [];
        t2.split('\n').forEach((str: string, x: number) => {
          if (str) {
            const strs = str.split('	');
            strs.slice(3).forEach((r, i) => {
              const v = Number(r);
              if (!arr[i]) {
                arr[i] = [];
              }
              if (!arr[i][v]) {
                arr[i][v] = [];
              }
              arr[i][v].push([Number(strs[0]), Number(strs[1]), Number(strs[2])]);
            });
          }
        });
        setLoading(false);
        setList(arr.map(item => item.filter((subItem: any) => subItem)));
      }).catch((err: string | Error) => {
        console.log(err);
        message.error(err);
        setLoading(false);
      });
    }, 1000);
  };
  const sendCommand = () => {
    if (config.cmd2) {
      setLoading(true);
      request('command/shell', `${config.cmd3} ${type} ${number}`).then(() => {
        refreshData();
      }).catch((err: string | Error) => {
        message.error(err);
        setLoading(false);
      });
    } else {
      refreshData();
    }
  }
  const addChartData = (i: number) => {
    if (!chartRef.current) {
      message.destroy();
      return;
    }
    if (i > 0 && !list[i]) {
      message.destroy();
      return;
    }
    if (i === 0) {
      chartRef.current.setOption({
        series: [],
      }, {
        replaceMerge: "series"
      });
      message.destroy();
      message.loading('开始计算', 0);
      setTimeout(() => {
        addChartData(i + 1);
      }, 2000);
      return;
    }
    message.destroy();
    message.loading(`计算中${(Math.round((i + 1) / list.length * 100) )}%`, 0);
    const series = list[i].map((v) => ({
      type: 'scatter3D',
      dimensions: ['x', 'y', 'z'],
      data: v,
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
    }));
    chartRef.current.setOption({
      series
    });
    setTimeout(() => {
      addChartData(i + 1);
    }, 2000);
  };
  useEffect(refreshData, [1]);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (!chartRef.current) {
      chartRef.current = echarts.init(ref.current, 'dark');
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
      };
      chartRef.current.setOption(option);
    }
    if (list.length > 0) {
      addChartData(0);
    }
  }, [list, ref.current]);
  return (
    <div className="dir-select chart-container">
      <div className="header">
        <div className="sub-header">
          评价指标：&emsp;ACC={info.acc}&emsp;MINI={info.mini}&emsp;F={info.f}&emsp;RI={info.ri}
        </div>
        <span>簇数量：</span>
        <InputNumber
          value={number}
          onBlur={sendCommand}
          onPressEnter={sendCommand}
          onChange={(v) => setNumber(v)}
        />
        <Select value={type} onChange={(v) => setType(v)} onSelect={sendCommand}>
          <Option key="mfdcca" value="mfdcca">基于MFDCCA的子空间特征</Option>
          <Option key="lmfdcca" value="lmfdcca">基于LMFDCCA的子空间特征</Option>
        </Select>
      </div>
      <div className="content" ref={ref}>
      </div>
      <div className="footer">
        <Button
          type="primary"
          onClick={first}
        >
          <HomeOutlined />首页
        </Button>
        <Button
          onClick={last}
        >
          <ArrowLeftOutlined />上一步
        </Button>
      </div>
    </div>
  );
};

export default DataChart;