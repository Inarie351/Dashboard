export default function BoardStatsConfig({ value, onChange }) {
  return (
    <div>
      <label htmlFor="board_stats-board_id" className="block text-sm text-brown-600 mb-1">
        Board ID
      </label>
      <input
        id="board_stats-board_id"
        type="text"
        value={value.board_id || ''}
        onChange={(e) => onChange({ ...value, board_id: e.target.value })}
        placeholder="e.g. 987654321012345678"
        className="w-full rounded-md bg-white/60 border border-brown-200 px-3 py-2 text-brown-800 focus:outline-none focus:ring-2 focus:ring-brown-500"
      />
    </div>
  );
}
