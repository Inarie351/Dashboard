// No client.js here — unlike every other service, there's no HTTP call to make. The "data
// source" is the server's own clock, read through Intl for timezone conversion.
function getTimeParts(timezone) {
  let parts;
  try {
    parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).formatToParts(new Date());
  } catch {
    // Intl throws RangeError for a timezone it doesn't recognize (typo, non-IANA name, ...).
    const err = new Error(`Unknown timezone "${timezone}"`);
    err.status = 400;
    throw err;
  }

  const get = (type) => parts.find((p) => p.type === type)?.value;
  return {
    timezone,
    hours: Number(get('hour')),
    minutes: Number(get('minute')),
    seconds: Number(get('second')),
    weekday: get('weekday'),
    date: `${get('month')} ${get('day')}, ${get('year')}`,
  };
}

// 24 hours is plenty for a kitchen/pomodoro-style timer and keeps the display to HH:MM:SS.
const MAX_TIMER_MINUTES = 24 * 60;

// The timer's running state (started, paused, time left) lives in the browser — it changes every
// second and on every click, which a poll every refreshRate seconds can't follow. The server only
// owns what the user configured: it validates the duration and hands it back in seconds.
function getTimerSettings({ label, minutes, seconds }) {
  if (minutes < 0 || minutes > MAX_TIMER_MINUTES || seconds < 0 || seconds > 59) {
    const err = new Error(
      `Timer minutes must be between 0 and ${MAX_TIMER_MINUTES}, seconds between 0 and 59`,
    );
    err.status = 400;
    throw err;
  }
  const durationSeconds = minutes * 60 + seconds;
  if (durationSeconds === 0) {
    const err = new Error('Timer duration must be longer than 0 seconds');
    err.status = 400;
    throw err;
  }
  return { label, durationSeconds };
}

const handlers = {
  digital_clock: (config) => getTimeParts(config.timezone),
  analog_clock: (config) => getTimeParts(config.timezone),
  timer: (config) => getTimerSettings(config),
};

async function fetchWidgetData(widgetName, config) {
  const handler = handlers[widgetName];
  if (!handler) {
    const err = new Error(`Unknown clock widget "${widgetName}"`);
    err.status = 400;
    throw err;
  }
  const data = handler(config);
  return { data, fetchedAt: new Date().toISOString() };
}

module.exports = { fetchWidgetData, getTimeParts };
