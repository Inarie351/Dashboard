import { useEffect, useState } from 'react';
import WidgetFrame from '../WidgetFrame';

// Countdown's mirror image: instead of counting down to a target date, this counts up from a
// start date. Same live client-side ticking between Timer polls, just the other direction.
function diffParts(startDate) {
  const diffMs = Date.now() - new Date(startDate).getTime();
  const future = diffMs < 0;
  const totalSeconds = Math.floor(Math.abs(diffMs) / 1000);
  return {
    future,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function DaysSince({ data, fetchedAt, size }) {
  const [parts, setParts] = useState(() => (data ? diffParts(data.startDate) : null));

  useEffect(() => {
    if (!data) {
      setParts(null);
      return undefined;
    }
    setParts(diffParts(data.startDate));
    const id = setInterval(() => setParts(diffParts(data.startDate)), 1000);
    return () => clearInterval(id);
  }, [data]);

  return (
    <WidgetFrame size={size} data={parts} fetchedAt={fetchedAt}>
      {() => (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="flex gap-2 font-display text-lg font-bold tabular-nums text-brown-800">
            <span>{parts.days}d</span>
            <span>{pad(parts.hours)}h</span>
            <span>{pad(parts.minutes)}m</span>
            <span>{pad(parts.seconds)}s</span>
          </div>
          <p className="mt-1 text-xs text-brown-400">{parts.future ? 'until it starts' : 'ago'}</p>
          <p className="mt-1 text-sm text-brown-600">{data.label}</p>
        </div>
      )}
    </WidgetFrame>
  );
}
