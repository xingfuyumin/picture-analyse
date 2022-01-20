import { Button, message, Upload } from 'antd';
import React, { FC, useState, useRef } from 'react';
import './upload.less';
import { Config } from '../type';
import { ArrowRightOutlined, UploadOutlined } from '@ant-design/icons';

type Props = {
  config: Config;
  next: () => void;
  setLoading: (loading: boolean) => void;
};
const request = (window as any).request;
const DirSelect: FC<Props> = ({
  config,
  next, setLoading,
}) => {
  const [files, setFiles] = useState([] as string[]);
  const ref = useRef([] as string[]);
  const countData = (dir: string) => {
    if (config.cmd) {
      setLoading(true);
      request('command/shell', `${config.cmd} ${dir}/`).then(() => {
        next();
        setLoading(false);
      }).catch((err: string) => {
        message.error(err);
        setLoading(false);
      });
    } else {
      next();
    }
  }
  return (
    <div className="dir-select">
      {
        files.length === 0 &&
        <Upload
          accept={config.img}
          showUploadList={false}
          directory
          multiple
          beforeUpload={(f: any) => {
            const path: string = f.path;
            if (path) {
              ref.current.push(path);
              setFiles([...ref.current]);
            }
            return false;
          }}
        >
          <Button type='primary' className="centerButton"><UploadOutlined />上传文件夹</Button>
        </Upload>
      }
      {
        files.length > 0 &&
        <div className="content">
          {
            files.map((file) => <img src={`file:///${file}`} alt="" key={file} />)
          }
        </div>
      }
      {
        files.length > 0 &&
        <div className="footer">
          <Upload
            accept={config.img}
            showUploadList={false}
            directory
            multiple
            beforeUpload={(f: any) => {
              const path: string = f.path;
              if (path) {
                ref.current.push(path);
                setFiles([...ref.current]);
              }
              return false;
            }}
          >
            <Button
              onClick={() => {
                ref.current = [];
              }}
            >
              <UploadOutlined />重新上传
            </Button>
          </Upload>
          <Button
            type="primary"
            onClick={() => {
              const dir = files[0].substring(0, files[0].lastIndexOf('/'));
              countData(dir);
            }}
          >
            下一步<ArrowRightOutlined />
          </Button>
        </div>
      }
    </div >
  );
};

export default DirSelect;