import { useEffect, useState } from 'react';

// The server only gives us a snapshot (hours/minutes/seconds as of `fetchedAt`) every
// refreshRate seconds via the Timer. To make the clock actually tick, we advance that snapshot
// client-side every second based on elapsed wall-clock time, instead of waiting for the next
// poll — the server stays the source of truth for the timezone conversion itself.
function tick(data, fetchedAt) {
  const elapsedSeconds = Math.floor((Date.now() - new Date(fetchedAt).getTime()) / 1000);
  let totalSeconds = data.hours * 3600 + data.minutes * 60 + data.seconds + elapsedSeconds;
  totalSeconds = ((totalSeconds % 86400) + 86400) % 86400;
  return {
    ...data,
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function useLiveClock(data, fetchedAt) {
  const [now, setNow] = useState(() => (data ? tick(data, fetchedAt) : null));

  useEffect(() => {
    if (!data) {
      setNow(null);
      return undefined;
    }
    setNow(tick(data, fetchedAt));
    const id = setInterval(() => setNow(tick(data, fetchedAt)), 1000);
    return () => clearInterval(id);
  }, [data, fetchedAt]);

  return now;
}
