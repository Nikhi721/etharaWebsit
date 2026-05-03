import { memo, useEffect, useState } from 'react';
import { formatTime } from '../../utils/time.js';

const LiveTimer = memo(({ isActive, startTime = 0 }) => {
  const [seconds, setSeconds] = useState(startTime);

  useEffect(() => {
    setSeconds(startTime);
  }, [startTime, isActive]);

  useEffect(() => {
    if (!isActive) return undefined;
    const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  return <span>{formatTime(seconds)}</span>;
});

export default LiveTimer;
