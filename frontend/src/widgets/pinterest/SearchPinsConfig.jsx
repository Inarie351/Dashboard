export default function SearchPinsConfig({ value, onChange }) {
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="search_pins-query" className="block text-sm text-brown-600 mb-1">
          Search keyword
        </label>
        <input
          id="search_pins-query"
          type="text"
          value={value.query || ''}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
          placeholder="e.g. minimalist bedroom"
          className="w-full rounded-md bg-white/60 border border-brown-200 px-3 py-2 text-brown-800 focus:outline-none focus:ring-2 focus:ring-brown-500"
        />
      </div>
      <div>
        <label htmlFor="search_pins-count" className="block text-sm text-brown-600 mb-1">
          Number of pins
        </label>
        <input
          id="search_pins-count"
          type="number"
          min="1"
          max="25"
          value={value.count || ''}
          onChange={(e) => onChange({ ...value, count: Number(e.target.value) })}
          className="w-full rounded-md bg-white/60 border border-brown-200 px-3 py-2 text-brown-800 focus:outline-none focus:ring-2 focus:ring-brown-500"
        />
      </div>
    </div>
  );
}
