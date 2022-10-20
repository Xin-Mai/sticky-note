import React, { useEffect, useRef, useState } from 'react';
import CircularProgress, { Status } from './CircularProgress/CircularProgress';

export default function Clock() {
  const [date, setDate] = useState<Date>(new Date());
  const [status, setStatus] = useState<Status>('setting');
  const timerID = useRef<undefined | NodeJS.Timer>();

  const tick = (): void => {
    setDate(new Date());
  }

  const onStatusChange = (s: Status) => {
    setStatus(s);
  }

  useEffect(() => {
    timerID.current = setInterval(
      () => tick(),
      1000
    );
    
    return () => {
      clearInterval(timerID.current);
      timerID.current = undefined;
    }
  }, [])

  return (
    <div>
      <CircularProgress
        size={400}
        status={status}
        onStatusChange={onStatusChange}
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
    </div>
  )
};