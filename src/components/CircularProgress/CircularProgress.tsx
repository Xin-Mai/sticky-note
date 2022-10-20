import React, { useEffect, useRef, useState } from 'react';
import { hexToRGBA } from '../../uitl';
import './CircularProgress.scss';

export type Status = 'setting' | 'counting';

interface Props {
  id?: string;
  size?: number;
  color?: string;
  status?: Status;
  style?: React.CSSProperties,
  onStatusChange?(status: Status): void;
}

export default function CircularProgress(props: Props) {
  const { id = 'circular-progress', size = 200, color = '#61dafb', status = 'setting' } = props;
  const lineWidth = size / 40;
  const [initVal, setInitVal] = useState(0);
  const [canvasCtx, setCanvasCtx] = useState<null | CanvasRenderingContext2D>(null);

  const slotPath = useRef<null | Path2D>(null);
  const buttonPath = useRef<null | Path2D>(null);
  const canvas = useRef<null | HTMLCanvasElement>(null);
  const dragging = useRef<boolean>(false);

  // get canvas element
  useEffect(() => {
    canvas.current = document.getElementById(id) as HTMLCanvasElement;
    return () => {canvas.current = null };
  });

  // init context
  useEffect(() => {
    if (!canvas.current) return;
    const ctx = canvas.current.getContext('2d');
    ctx?.save();
    ctx?.scale(window.devicePixelRatio, window.devicePixelRatio);
    setCanvasCtx(ctx);

    return () => {
      ctx?.restore();
      ctx?.clearRect(0, 0, size, size)
      setCanvasCtx(null);
    }
  }, [id, size]);

  // draw slot
  useEffect(() => {
    const ctx = canvasCtx;
    if (!ctx) return;
    const radius = size / 2;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = hexToRGBA(color, 0.2);

    const path = new Path2D();
    path.arc(radius, radius, radius - lineWidth, 0, 2 * Math.PI);
    ctx.stroke(path);

    slotPath.current = path;

    return () => { slotPath.current = null };
  }, [size, color, lineWidth, initVal, canvasCtx]);

  // draw button
  useEffect(() => {
    const ctx = canvasCtx;
    if (status !=='setting' || !ctx) return;
    ctx.save();
    // move the (0, 0) to the center of canvas
    ctx.translate(size / 2, size / 2);
    ctx.rotate(initVal);
    //draw button
    const path = new Path2D();
    path.arc(0, - size / 2 + lineWidth, lineWidth / 2 + 1, 0, 2 * Math.PI);
    buttonPath.current = path;
    ctx.fillStyle='#fff';
    ctx.fill(path);
    ctx.strokeStyle=color;
    ctx.lineWidth = 2;
    ctx.stroke(path);

    ctx.restore();

    return () => { 
      buttonPath.current = null;
      canvasCtx?.clearRect(0, 0, size, size);
    };
  }, [canvasCtx, color, initVal, lineWidth, size, status]);

  // const drawRing = (ctx: CanvasRenderingContext2D) => {
  // };

  // const test = (x: number, y: number) => {
  //   const path = new Path2D();
  //   path.arc(x, y, 10, 0, 2 * Math.PI);
  //   canvasCtx?.fill(path);
  // }

  const getCoordination = (e: React.MouseEvent): {x: number, y: number} => {
    const res = {
      x: -1,
      y: -1,
    };
    if (!canvas || !slotPath.current || !canvas.current) return res;
    const { top, left } = canvas.current.getBoundingClientRect();
    res.x = (e.clientX - left) * window.devicePixelRatio;
    res.y = (e.clientY - top) * window.devicePixelRatio;
    return res;
  }

  const transletePoint = (x: number, y: number): {x: number, y: number} => {
    const translete = size / 2 * window.devicePixelRatio;
    let tx = x - translete;
    let ty = y - translete;
    return {x: tx, y: ty };
  }
  const pointInButton = (x: number, y: number): boolean => {
    if (!canvasCtx || !buttonPath.current) return false;
    let {x: tx , y: ty} = transletePoint(x, y);
    // rotate back
    const newX = tx * Math.cos(initVal) + ty * Math.sin(initVal);
    const newY = ty * Math.cos(initVal) - tx * Math.sin(initVal);
    return canvasCtx?.isPointInPath(buttonPath.current, newX, newY) || canvasCtx.isPointInStroke(buttonPath.current, newX, newY);
  }

  const pointInSlot = (x: number, y: number): boolean => {
    if (!canvasCtx || !slotPath.current) return false;
    return canvasCtx.isPointInStroke(slotPath.current, x , y);
  }

  const calculateAngle = (x: number, y: number): number => {
    const {x: tx , y: ty} = transletePoint(x, y);
    const dot = tx * 0 + ty * (-1);
    const det = tx * (-1) - ty * 0;
    return -Math.atan2(det, dot);
  }

  const handleMouseMove = (e: React.MouseEvent): void => {
    let {x, y} = getCoordination(e);
    if (!canvas.current) return;

    if (dragging.current) {
      // redraw
      setInitVal(calculateAngle(x, y));
    } else {
      if (pointInButton(x, y)) {
        canvas.current.style.cursor = 'pointer';
      } else {
        canvas.current.style.cursor = 'default';
      }
    }
  }

  const handleMouseDown = (e: React.MouseEvent): void => {
    if (props.status === 'counting') return;
    const {x, y} = getCoordination(e);
    if (pointInButton(x, y)) {
      dragging.current = true;
    } else if (pointInSlot(x, y)) {
      // redraw the bar
      setInitVal(calculateAngle(x, y))
    }
  }

  const handleMouseUp = () => {
    dragging.current = false;
  }

  return (
    <canvas
      id={id}
      width={size * window.devicePixelRatio}
      height={size * window.devicePixelRatio}
      style={{width: '100%', ...props.style}}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
    </canvas>
  );
}