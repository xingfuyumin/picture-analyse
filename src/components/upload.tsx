import { Button, message, Upload } from 'antd';
import React, { FC, useEffect, useState, useRef } from 'react';
import './upload.less';
import { Config } from '../type';

type Props = {
  config: Config;
  countData: (dir: string) => void;
};
const request = (window as any).request;

const DirSelect: FC<Props> = ({
  config,
  countData,
}) => {
  const [files, setFiles] = useState([] as string[]);
  const ref = useRef([] as string[]);
  return (
    <div className="dir-select">
      <div className="header">
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
            type={files.length === 0 ? 'primary' : 'default'}
            onClick={() => {
              ref.current = [];
            }}
          >
            {files.length === 0 ? '上传文件夹' : '重新上传'}
          </Button>
        </Upload>
        {
          files.length > 0 &&
          <Button
            type="primary"
            onClick={() => {
              const dir = files[0].substring(0, files[0].lastIndexOf('/'));
              countData(dir);
            }}
          >
            开始计算
          </Button>
        }
      </div>
      <div className="content">
        {
          files.map((file) => <img src={`file:///${file}`} alt="" key={file}/>)
        }
      </div>
    </div >
  );
};

export default DirSelect;