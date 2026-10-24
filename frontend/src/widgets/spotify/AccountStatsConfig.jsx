export default function AccountStatsConfig({ value, onChange }) {
  return (
    <div>
      <label htmlFor="sp_account_stats-artist_id" className="block text-sm text-brown-600 mb-1">
        Artist ID
      </label>
      <input
        id="sp_account_stats-artist_id"
        type="text"
        value={value.artist_id || ''}
        onChange={(e) => onChange({ ...value, artist_id: e.target.value })}
        placeholder="06HL4z0CvFAxyc27GXpf02"
        className="w-full rounded-md bg-white/60 border border-brown-200 px-3 py-2 text-brown-800 focus:outline-none focus:ring-2 focus:ring-brown-500"
      />
    </div>
  );
}
