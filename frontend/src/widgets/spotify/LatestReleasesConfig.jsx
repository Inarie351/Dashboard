export default function LatestReleasesConfig({ value, onChange }) {
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="sp_latest_releases-artist_id" className="block text-sm text-brown-600 mb-1">
          Artist ID
        </label>
        <input
          id="sp_latest_releases-artist_id"
          type="text"
          value={value.artist_id || ''}
          onChange={(e) => onChange({ ...value, artist_id: e.target.value })}
          placeholder="06HL4z0CvFAxyc27GXpf02"
          className="w-full rounded-md bg-white/60 border border-brown-200 px-3 py-2 text-brown-800 focus:outline-none focus:ring-2 focus:ring-brown-500"
        />
      </div>
      <div>
        <label htmlFor="sp_latest_releases-count" className="block text-sm text-brown-600 mb-1">
          Number of items
        </label>
        <input
          id="sp_latest_releases-count"
          type="number"
          min="1"
          max="20"
          value={value.count || ''}
          onChange={(e) => onChange({ ...value, count: Number(e.target.value) })}
          className="w-full rounded-md bg-white/60 border border-brown-200 px-3 py-2 text-brown-800 focus:outline-none focus:ring-2 focus:ring-brown-500"
        />
      </div>
    </div>
  );
}
