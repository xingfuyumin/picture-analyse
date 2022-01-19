import { message, Spin } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import './img.less';

const request = (window as any).request;
type Props = {
  setLoading: (loading: boolean) => void;
};
type Img = {
  origin: string;
  lbp: string;
  gobar: string;
  sift: string;
};

const ImgBlock: FC<Props> = ({
  setLoading,
}) => {
  const [list, setList] = useState([] as Img[]);
  useEffect(() => {
    setLoading(true);
    Promise.all([request('file/readDir', `tmp/img/origin`), request('file/readDir', `tmp/img/gobar`),
    request('file/readDir', `tmp/img/sift`), request('file/readDir', `tmp/img/lbp`),
    request('file/getRootDir')]).then(([l1, l2, l3, l4, dir]) => {
      const gobar: Record<string, string> = {};
      const sift: Record<string, string> = {};
      const lbp: Record<string, string> = {};
      const l: Img[] = [];
      l2.forEach((i: string) => {
        gobar[i] = `${dir}/tmp/img/gobar/${i}`;
      });
      l3.forEach((i: string) => {
        sift[i] = `${dir}/tmp/img/sift/${i}`;
      });
      l4.forEach((i: string) => {
        lbp[i] = `${dir}/tmp/img/lbp/${i}`;
      });
      l1.forEach((i: string) => {
        l.push({
          origin: `${dir}/tmp/img/origin/${i}`,
          gobar: gobar[i],
          sift: sift[i],
          lbp: lbp[i],
        });
        setList(l);
      });
      setLoading(false);
    }).catch((err: string) => {
      message.error(err);
      setLoading(false);
    });
  }, [1]);
  return (
    <div className="img-container">
      {
        list.map((item) => (
          <div className="img" key={item.origin}>
            <div className="img-left">
              <div className="img-right">
                <img src={item.origin} alt="" />
                <div>原始视图</div>
              </div>
            </div>
            <div className="img-right">
              <img src={item.lbp} alt="" />
              <div>LBP特征</div>
            </div>
            <div className="img-right">
              <img src={item.gobar} alt="" />
              <div>gobar特征</div>
            </div>
            <div className="img-right">
              <img src={item.sift} alt="" />
              <div>sift特征</div>
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default ImgBlock;