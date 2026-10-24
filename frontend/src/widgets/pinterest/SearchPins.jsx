import WidgetFrame from '../WidgetFrame';

export default function SearchPins({ data, fetchedAt, size }) {
  return (
    <WidgetFrame size={size} data={data} fetchedAt={fetchedAt}>
      {(d) =>
        d.pins.length === 0 ? (
          <p className="text-sm text-brown-400">No pins found for &quot;{d.query}&quot;.</p>
        ) : (
          <div>
            <p className="mb-1 truncate text-[11px] text-brown-400">Results for &quot;{d.query}&quot;</p>
            <div className="grid grid-cols-2 gap-2">
              {d.pins.map((pin) => (
                <a
                  key={pin.id}
                  href={pin.link || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="block overflow-hidden rounded-lg border border-card-2/60"
                >
                  {pin.imageUrl ? (
                    <img
                      src={pin.imageUrl}
                      alt={pin.title || 'Pin'}
                      className="h-16 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-full items-center justify-center bg-brown-600/10 text-[10px] text-brown-400">
                      No image
                    </div>
                  )}
                  {pin.title && (
                    <p className="truncate px-1 py-0.5 text-[11px] text-brown-700">{pin.title}</p>
                  )}
                </a>
              ))}
            </div>
          </div>
        )
      }
    </WidgetFrame>
  );
}
