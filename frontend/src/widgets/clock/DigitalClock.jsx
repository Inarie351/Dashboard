import WidgetFrame from '../WidgetFrame';
import { useLiveClock } from './useLiveClock';

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function DigitalClock({ data, fetchedAt, size }) {
  const liveData = useLiveClock(data, fetchedAt);

  return (
    <WidgetFrame size={size} data={liveData} fetchedAt={fetchedAt}>
      {(d) => (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <p className="font-display text-3xl font-bold tabular-nums text-brown-800">
            {pad(d.hours)}:{pad(d.minutes)}:{pad(d.seconds)}
          </p>
          <p className="mt-1 text-xs text-brown-400">
            {d.weekday}, {d.date}
          </p>
          <p className="text-[11px] text-brown-300">{d.timezone}</p>
        </div>
      )}
    </WidgetFrame>
  );
}
