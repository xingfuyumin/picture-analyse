import { message, Spin, Steps } from 'antd';
import React, { useEffect, useState } from 'react';
import './app.less';
import DirSelect from './components/upload';
import { Config } from './type';
import DataChart from './components/chart';
import DataTable from './components/table';
import ImgBlock from './components/img';

const request = (window as any).request;
const { Step } = Steps;
// 默认配置
const defaultConfig = {
  img: '.png,.gif',
  cmd: '',
  cmd2: '',
  cmd3: '',
};
const App = () => {
  const [config, setConfig] = useState({} as Config);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      request('file/readFile', 'config.json').then((str: string) => {
        setConfig({ ...defaultConfig, ...JSON.parse(str) })
        setLoading(false);
      }).catch((err: string) => {
        setConfig(defaultConfig);
        setLoading(false);
      });
    }, 1000);
  }, [1]);
  const stepContent = [
    <DirSelect
      config={config}
      next={() => setStep(1)}
      setLoading={setLoading}
    />,
    <ImgBlock
      config={config}
      setLoading={setLoading}
      next={() => setStep(2)}
      last={() => setStep(0)}
    />,
    <DataTable
      setLoading={setLoading}
      next={() => setStep(3)}
      last={() => setStep(1)}
      first={() => setStep(0)}
    />,
    <DataChart
      config={config}
      setLoading={setLoading}
      last={() => setStep(1)}
      first={() => setStep(0)}
    />,
  ];
  return (
    <Spin spinning={loading}>
      <div className="container">
        <div className="con-header">
          <Steps current={step}>
            <Step title="预处理" description="批量上传图片以提取信息" status={step === 0 ? 'process' : 'finish'}>

            </Step>
            <Step title="多视图构建" description="上传图片查看效果" status={step === 1 ? 'process' : step < 1 ? 'wait' : 'finish'}>

            </Step>
            <Step title="特征表示" description="查看特征信息" status={step === 2 ? 'process' : step < 2 ? 'wait' : 'finish'}>

            </Step>
            <Step title="聚类分析" description="通过三维坐标图显示聚类结果" status={step === 3 ? 'process' : 'wait'}>

            </Step>
          </Steps>
        </div>
        <div className="con-content">
          {stepContent[step]}
        </div>
      </div>
    </Spin>
  );
};

export default App;