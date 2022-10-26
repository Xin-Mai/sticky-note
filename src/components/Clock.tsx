import { HourglassBottomOutlined, HourglassEmptyOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import CircularProgress, { Status } from './CircularProgress/CircularProgress';

export default function Clock() {
  const [date, setDate] = useState<Date>(new Date());
  const [status, setStatus] = useState<Status>('setting');
  const [isTicking, setIsTicking] = useState<boolean>(true);
  const [progressAngel, setProgressAngel] = useState<number>(0);

  const timerID = useRef<undefined | NodeJS.Timer>();
  const curAngel = useRef<number>(0);

  const tick = useCallback(
    (): void => {
      if (status === 'counting') {
        const angel = 6.28 / 10800;

        if (curAngel.current >= angel  && date.toLocaleTimeString() !== '00:00:00') {
          const countDown = new Date(date);
          countDown.setTime(date.getTime() - 1000);
          setDate(countDown);
        }

        curAngel.current = curAngel.current >= angel ? curAngel.current - angel : 0;
        setProgressAngel(curAngel.current);
      } else {
        setDate(new Date());
      }
    },
    [date, status]
  )

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

  const manageCountDown = () => {
    status === 'setting' ? startCountDown() : stopCountDown();
  };

  const startCountDown = () => {
    if (curAngel.current > 0) {
      setStatus('counting');
      setIsTicking(true);
    }
  };

  const stopCountDown = () => {
    curAngel.current = 0;
    setProgressAngel(0);
    setDate(new Date());
    setStatus('setting');
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
      <Button
        variant="outlined"
        size="large"
        startIcon={ status === 'setting' ? <HourglassEmptyOutlined /> : <HourglassBottomOutlined/>}
        className="board-add"
        onClick={manageCountDown} 
      >
        { status === 'setting' ? 'START' : 'QUIT'}
      </Button>
    </div>
  )
};