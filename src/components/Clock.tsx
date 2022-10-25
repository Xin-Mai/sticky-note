import { PlayCircleFilledOutlined, StopCircleOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import CircularProgress, { Status } from './CircularProgress/CircularProgress';

export default function Clock() {
  const [date, setDate] = useState<Date>(new Date());
  const [status, setStatus] = useState<Status>('setting');
  const [isTicking, setIsTicking] = useState<boolean>(true);
  const [progressAngel, setProgressAngel] = useState<number>(0);

  const timerID = useRef<undefined | NodeJS.Timer>();
  const curAngel = useRef<number>(0);

  const tick = (): void => {
    if (status === 'counting') {
      const countDown = new Date(date);
      countDown.setTime(date.getTime() - 1000);
      setDate(countDown);
    } else {
      setDate(new Date());
    }
  }

  const onStatusChange = (s: Status) => {
    setStatus(s);
  }

  const setTime = (angel: number) => {
    curAngel.current = angel;

    if (isTicking) {
      setIsTicking(false);
    }
    let secs = 10800;
    const near2Pi = 6.28;
    if (angel <= near2Pi) {
      secs *= angel / near2Pi;
    }
    const countDown = new Date();
    countDown.setHours(Math.floor(secs / 3600), Math.floor(secs % 3600 / 60), secs % 60);
    console.log('[setTime]', countDown.toLocaleTimeString());
    setDate(countDown);
  }

  useEffect(() => {
    if (isTicking) {
      timerID.current = setInterval(
        () => tick(),
        1000
      );
    }
    return () => {
      clearInterval(timerID.current);
      timerID.current = undefined;
    }
  }, [isTicking, tick]);

  const startCountDown = () => {
    setStatus('counting');
    setIsTicking(true);
    setProgressAngel(curAngel.current);
  };

  const stopCountDown = () => {
    setStatus('setting');
    setProgressAngel(0);
    // setIsTicking(false);
  };

  return (
    <div>
      <CircularProgress
        size={500}
        status={status}
        initVal={progressAngel}
        onStatusChange={onStatusChange}
        onInitValChange={setTime}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <h1
        style={{
          fontSize: '3em',
          fontFamily: 'Menlo',
          margin: '0.3em',
        }}
      >
        { date.toLocaleTimeString() }
      </h1>
      {
        status === 'setting' &&
        <IconButton color="primary" onClick={startCountDown}>
          <PlayCircleFilledOutlined />
        </IconButton>
      }
      <IconButton color="primary" onClick={stopCountDown}>
        <StopCircleOutlined />
      </IconButton>
    </div>
  )
};