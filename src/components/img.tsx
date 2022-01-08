import { message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import './img.less';

const request = (window as any).request;

const list = [
  {
    position: 'left',
    content: 'host:///img.png',
    name: '原始视图',
  },
  {
    position: 'right',
    content: 'host:///img-lbp.png',
    name: 'LBP特征',
  },
  {
    position: 'right',
    content: 'host:///img-gobar.png',
    name: 'gobar特征',
  },
  {
    position: 'right',
    content: 'host:///img-sift.png',
    name: 'sift特征',
  }
];

const ImgBlock = () => {
  return (
    <div className="img-container">
      <div className="img-title">多视图构建:</div>
      <div className="img-content">
        {
          list.map(v => (
            <div className={`img-block img-block-${v.position}`} key={v.name}>
              <img src={v.content} alt="" />
              <div>{v.name}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default ImgBlock;