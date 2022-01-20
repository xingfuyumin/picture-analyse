import { Button, message, Upload } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { Config } from '../type';
import './img.less';
import { ArrowLeftOutlined, UploadOutlined, ArrowRightOutlined } from '@ant-design/icons';

const request = (window as any).request;
type Props = {
  config: Config;
  setLoading: (loading: boolean) => void;
  next: () => void;
  last: () => void;
};

const ImgBlock: FC<Props> = ({
  config,
  setLoading, next, last,
}) => {
  const [file, setFile] = useState(null as string | null);
  const [rootDir, setRootDir] = useState(null as string | null);
  useEffect(() => {
    setLoading(true);
    request('file/getRootDir').then((str: string) => {
      setRootDir(str);
      setLoading(false);
    }).catch((err: string) => {
      message.error(err);
      setLoading(false);
    });
  }, [1]);
  return (
    <div className="dir-select img-container">
      {
        !file &&
        <Upload
          accept={config.img}
          showUploadList={false}
          beforeUpload={(f: any) => {
            const path: string = f.path;
            if (path) {
              if (config.cmd2) {
                setLoading(true);
                request('command/shell', `${config.cmd2} ${path}`).then(() => {
                  setFile(path);
                  setLoading(false);
                }).catch((err: string) => {
                  message.error(err);
                  setLoading(false);
                });
              } else {
                setFile(path);
              }
            }
            return false;
          }}
        >
          <Button type='primary' className="centerButton"><UploadOutlined />上传图片</Button>
        </Upload>
      }
      {
        file &&
        <div className="content img">
          <div className="img-left">
            <div>
              <img src={`${rootDir}/tmp/img.png`} alt="" />
              <div>原始视图</div>
            </div>
          </div>
          <div className="img-right">
            <img src={`${rootDir}/tmp/img-lbp.png`} alt="" />
            <div>LBP特征</div>
          </div>
          <div className="img-right">
            <img src={`${rootDir}/tmp/img-gobar.png`} alt="" />
            <div>gobar特征</div>
          </div>
          <div className="img-right">
            <img src={`${rootDir}/tmp/img-hog.png`} alt="" />
            <div>hog特征</div>
          </div>
        </div>
      }
      {
        file &&
        <div className="footer">
          <Button
            onClick={last}
          >
            <ArrowLeftOutlined />上一步
          </Button>
          <Upload
            accept={config.img}
            showUploadList={false}
            beforeUpload={(f: any) => {
              const path: string = f.path;
              if (path) {
                if (config.cmd2) {
                  setLoading(true);
                  request('command/shell', `${config.cmd2} ${path}`).then(() => {
                    setFile(path);
                    setLoading(false);
                  }).catch((err: string) => {
                    message.error(err);
                    setLoading(false);
                  });
                } else {
                  setFile(path);
                }
              }
              return false;
            }}
          >
            <Button>
              <UploadOutlined />重新上传
            </Button>
          </Upload>
          <Button
            type="primary"
            onClick={next}
          >
            下一步<ArrowRightOutlined />
          </Button>
        </div>
      }
    </div >
  );
};

export default ImgBlock;