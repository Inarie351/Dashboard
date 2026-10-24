import { useEffect, useState } from 'react';

// Like useLiveClock, but keeps sub-second precision and updates ~20 times a second instead of
// once a second — that's what makes the hands sweep continuously like a real analog clock
// instead of visibly jumping from one second to the next.
function tick(data, fetchedAt) {
  const elapsedMs = Date.now() - new Date(fetchedAt).getTime();
  const baseMs = (data.hours * 3600 + data.minutes * 60 + data.seconds) * 1000;
  const totalMs = (((baseMs + elapsedMs) % 86400000) + 86400000) % 86400000;
  const totalSeconds = totalMs / 1000;
  return {
    ...data,
    hours: Math.floor(totalSeconds / 3600) % 24,
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const TICK_MS = 50; // 20fps — smooth to the eye without redrawing every animation frame.

export function useSweepingClock(data, fetchedAt) {
  const [now, setNow] = useState(() => (data ? tick(data, fetchedAt) : null));

  useEffect(() => {
    if (!data) {
      setNow(null);
      return undefined;
    }
    setNow(tick(data, fetchedAt));
    const id = setInterval(() => setNow(tick(data, fetchedAt)), TICK_MS);
    return () => clearInterval(id);
  }, [data, fetchedAt]);

  return now;
}
