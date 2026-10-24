export default function SavedPinsConfig({ value, onChange }) {
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="saved_pins-board_id" className="block text-sm text-brown-600 mb-1">
          Board ID
        </label>
        <input
          id="saved_pins-board_id"
          type="text"
          value={value.board_id || ''}
          onChange={(e) => onChange({ ...value, board_id: e.target.value })}
          placeholder="e.g. 987654321012345678"
          className="w-full rounded-md bg-white/60 border border-brown-200 px-3 py-2 text-brown-800 focus:outline-none focus:ring-2 focus:ring-brown-500"
        />
      </div>
      <div>
        <label htmlFor="saved_pins-count" className="block text-sm text-brown-600 mb-1">
          Number of pins
        </label>
        <input
          id="saved_pins-count"
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
