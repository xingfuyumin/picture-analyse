import { Button, message, Spin, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import './app.less';
import { Config } from './type';
import ImgBlock from './components/img';
import DataTable from './components/table';
import DataChart from './components/chart';

const Dragger = Upload.Dragger;
const request = (window as any).request;

const App = () => {
  const [file, setFile] = useState(null);
  const [config, setConfig] = useState({} as Config);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    request('file/readConfig').then((v: Config) => {
      setConfig(v);
      setLoading(false);
    }).catch((err: string) => {
      message.error(err);
      setLoading(false);
    });
  }, [1]);
  if (!file) {
    return (
      <div className="nofile">
        <Spin spinning={loading}>
          <Dragger
            accept={config.img}
            showUploadList={false}
            beforeUpload={(f: any) => {
              if (config.cmd) {
                setLoading(true);
                request('command/shell', `${config.cmd} ${f.path}`).then(() => {
                  setFile(f.path);
                  setLoading(false);
                }).catch((err: string | Error) => {
                  message.error(err);
                  setLoading(false);
                });
              } else {
                setFile(f.path);
              }
              return false;
            }}
          >
            <InboxOutlined />
            <p>
              点击选择图片文件或拖拽图片上传
            </p>
          </Dragger>
        </Spin>
      </div>
    );
  }
  return (
    <div className="container">
      <ImgBlock />
      <DataTable />
      <DataChart path={file} config={config}/>
      <Button type="primary" onClick={() => setFile(null)}>返回</Button>
    </div>
  );
};

export default App;