export default function NowPlayingConfig({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input
        id="now_playing-show_progress"
        type="checkbox"
        checked={Boolean(value.show_progress)}
        onChange={(e) => onChange({ ...value, show_progress: e.target.checked ? 1 : 0 })}
        className="h-4 w-4 rounded border-brown-200 text-brown-600 focus:ring-brown-500"
      />
      <label htmlFor="now_playing-show_progress" className="text-sm text-brown-600">
        Show playback progress
      </label>
    </div>
  );
}
