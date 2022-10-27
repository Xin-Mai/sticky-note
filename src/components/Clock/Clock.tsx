import { HourglassBottomOutlined, HourglassEmptyOutlined, ThumbUpOffAltOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import CircularProgress from '../CircularProgress/CircularProgress';
import ClockSwitch from './ClockSwitch';

export type Status = 'setting' | 'counting';

export default function Clock() {
  const [date, setDate] = useState<Date>(new Date());
  const [status, setStatus] = useState<Status>('setting');
  const [isTicking, setIsTicking] = useState<boolean>(true);
  const [progressAngel, setProgressAngel] = useState<number>(0);

  const [isBasicClock, setIsBasicClock] = React.useState(true);

  const timerID = useRef<undefined | NodeJS.Timer>();
  // const curAngel = useRef<number>(0);

  const tick = useCallback(
    (): void => {
      if (status === 'counting') {
        const angel = 6.28 / 10800;

        if (progressAngel >= angel  && date.toLocaleTimeString() !== '00:00:00') {
          const countDown = new Date(date);
          countDown.setTime(date.getTime() - 1000);
          setDate(countDown);
        }
        setProgressAngel(progressAngel >= angel ? progressAngel - angel : 0);
      } else if (isBasicClock){
        setDate(new Date());
      }
    },
    [date, isBasicClock, progressAngel, status]
  )

  const onStatusChange = (s: Status) => {
    setStatus(s);
  }

  const setTime = (angel: number) => {
    // curAngel.current = angel;
    setProgressAngel(angel);

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

  const handleClockModeChange = () => {
    if (isBasicClock) {
      clearCountDown();
    } else {
      setDate(new Date());
    }
    setIsBasicClock(!isBasicClock);
  }

  const clearCountDown = () => {
    // curAngel.current = 0;
    setProgressAngel(0);
    const clearTime = new Date();
    clearTime.setHours(0, 0, 0);
    setDate(clearTime);
    setStatus('setting');
  }

  const manageCountDown = () => {
    status === 'setting' ? startCountDown() : stopCountDown();
  };

  const startCountDown = () => {
    if (progressAngel > 0) {
      setStatus('counting');
      setIsTicking(true);
    }
  };

  const stopCountDown = () => {
    clearCountDown();
  };

  return (
    <div>
      <CircularProgress
        size={500}
        status={status}
        showButton={!isBasicClock}
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
      <ClockSwitch
        disabled={!isBasicClock && status === 'counting'}
        checked={!isBasicClock}
        onChange={handleClockModeChange}
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
        disabled={ status === 'setting' && progressAngel === 0}
        sx={{
          visibility: isBasicClock ? 'hidden': 'default',
        }}
        size="large"
        startIcon={ status === 'setting' ? <HourglassEmptyOutlined /> : progressAngel === 0 ? <ThumbUpOffAltOutlined/>: <HourglassBottomOutlined/>}
        className="board-add"
        onClick={manageCountDown} 
      >
        { status === 'setting' ? 'START' : progressAngel === 0 ? 'FINISHI' : 'QUIT'}
      </Button>
    </div>
  )
};