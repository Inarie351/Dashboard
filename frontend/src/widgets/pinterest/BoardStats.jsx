import WidgetFrame from '../WidgetFrame';

export default function BoardStats({ data, fetchedAt, size }) {
  return (
    <WidgetFrame size={size} data={data} fetchedAt={fetchedAt}>
      {(d) => (
        <div>
          <p className="font-medium text-brown-800">{d.name}</p>
          {d.description && <p className="mt-1 text-xs text-brown-400">{d.description}</p>}
          <div className="mt-2 flex gap-4 text-sm text-brown-600">
            <span>{d.pinCount} pins</span>
            <span>{d.followerCount} followers</span>
          </div>
        </div>
      )}
    </WidgetFrame>
  );
}
