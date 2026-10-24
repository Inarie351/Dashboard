import { useEffect } from 'react';

export default function TopContentConfig({ value, onChange }) {
  useEffect(() => {
    if (!value.time_range) {
      onChange({ ...value, time_range: 'medium_term' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <label htmlFor="sp_top_content-time_range" className="block text-sm text-brown-600 mb-1">
        Time range
      </label>
      <select
        id="sp_top_content-time_range"
        value={value.time_range || 'medium_term'}
        onChange={(e) => onChange({ ...value, time_range: e.target.value })}
        className="w-full rounded-md bg-white/60 border border-brown-200 px-3 py-2 text-brown-800 focus:outline-none focus:ring-2 focus:ring-brown-500"
      >
        <option value="short_term">Last 4 weeks</option>
        <option value="medium_term">Last 6 months</option>
        <option value="long_term">All time</option>
      </select>
    </div>
  );
}
