import WidgetFrame from '../WidgetFrame';

function formatMs(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function NowPlaying({ data, fetchedAt, size }) {
  return (
    <WidgetFrame size={size} data={data} fetchedAt={fetchedAt}>
      {(d) =>
        !d.isPlaying ? (
          <p className="text-sm text-brown-500">Nothing playing right now.</p>
        ) : (
          <>
            <p className="truncate text-lg font-semibold text-brown-800">{d.title}</p>
            <p className="truncate text-sm text-brown-500">{d.artist}</p>
            {d.progressMs != null && d.durationMs != null && (
              <>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-brown-200">
                  <div
                    className="h-full bg-brown-600"
                    style={{ width: `${(d.progressMs / d.durationMs) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-brown-400">
                  {formatMs(d.progressMs)} / {formatMs(d.durationMs)}
                </p>
              </>
            )}
          </>
        )
      }
    </WidgetFrame>
  );
}
