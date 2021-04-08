import './resizable.css';
import {
  ResizableBox,
  ResizableBoxProps,
  ResizeCallbackData,
} from 'react-resizable';
import { useEffect, useState } from 'react';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [ratio, setRatio] = useState(0.6);
  const [width, setWidth] = useState(window.innerWidth * ratio);

  useEffect(() => {
    let timer: any;
    const listener = () => {
      // use debouncing to enhance performance
      // only rerender the page when user stopped resizing
      // the window for more than 100ms
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        setWidth(window.innerWidth * ratio);
      }, 50);
    };
    window.addEventListener('resize', listener);

    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [ratio]);

  useEffect(() => {
    setRatio(width / innerWidth);
  }, [width, innerWidth]);

  const onResizeStop = (
    e: React.SyntheticEvent,
    data: ResizeCallbackData
  ): any => {
    setWidth(data.size.width);
  };

  const resizableBoxProps: ResizableBoxProps =
    direction === 'vertical'
      ? {
          maxConstraints: [Infinity, innerHeight * 0.9],
          minConstraints: [Infinity, 60],
          height: 300,
          width: Infinity,
          resizeHandles: ['s'],
        }
      : {
          className: 'resize-horizontal',
          maxConstraints: [innerWidth * 0.6, Infinity],
          minConstraints: [innerWidth * 0.25, Infinity],
          height: Infinity,
          width: width,
          resizeHandles: ['e'],
        };

  return (
    <ResizableBox {...resizableBoxProps} onResizeStop={onResizeStop}>
      {children}
    </ResizableBox>
  );
};

export default Resizable;
