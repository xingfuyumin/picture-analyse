import { Button, message, Spin, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import './app.less';
import DirSelect from './components/upload';
import { Config } from './type';
import DataChart from './components/chart';
import DataTable from './components/table';
import ImgBlock from './components/img';

const request = (window as any).request;
// 默认配置
const defaultConfig = {
  img: '.png,.gif',
  cmd: '',
  cmd2: '',
};
const TabPane = Tabs.TabPane;
const App = () => {
  const [dir, setDir] = useState(null as string | null);
  const [count, setCount] = useState(true);
  const [config, setConfig] = useState({} as Config);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    request('file/readFile', 'config.json').then((str: string) => {
      setConfig({ ...defaultConfig, ...JSON.parse(str) })
      setLoading(false);
    }).catch((err: string) => {
      setConfig(defaultConfig);
      setLoading(false);
    });
  }, [1]);
  const countData = (dir: string) => {
    setDir(dir);
    if (config.cmd) {
      setLoading(true);
      request('command/shell', `${config.cmd} ${dir}/`).then(() => {
        setCount(true);
        setLoading(false);
      }).catch((err: string) => {
        message.error(err);
        setLoading(false);
      });
    } else {
      setCount(true);
    }
  }
  return (
    <div className="container">
      <Spin spinning={loading}>
        {
          !count && <DirSelect config={config} countData={countData} />
        }
        {
          count && (
            <Tabs
              tabBarExtraContent={{
                right: <Button type="primary" onClick={() => setCount(false)}>重新计算</Button>
              }}
            >
              <TabPane key="1" tab="多视图构建">
                <ImgBlock setLoading={setLoading} />
              </TabPane>
              <TabPane key="2" tab="特征表示">
                <DataTable />
              </TabPane>
              <TabPane key="3" tab="聚类分析">
                <DataChart path={dir || ''} config={config} />
              </TabPane>
            </Tabs>
          )
        }
      </Spin>
    </div>
  );
};

export default App;