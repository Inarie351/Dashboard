const client = require('./client');

const handlers = {
  account_stats: (config, credentials) =>
    client.getAccountStats(credentials.accessToken, config.artist_id),
  latest_releases: (config, credentials) =>
    client.getLatestReleases(credentials.accessToken, config.artist_id, config.count),
  top_content: (config, credentials) =>
    client.getTopContent(credentials.accessToken, config.time_range),
  now_playing: (config, credentials) =>
    client.getNowPlaying(credentials.accessToken, config.show_progress),
};

async function fetchWidgetData(widgetName, config, credentials) {
  const handler = handlers[widgetName];
  if (!handler) {
    const err = new Error(`Unknown spotify widget "${widgetName}"`);
    err.status = 400;
    throw err;
  }
  if (!credentials?.accessToken) {
    const err = new Error('Spotify account not linked');
    err.status = 401;
    throw err;
  }
  const data = await handler(config, credentials);
  return { data, fetchedAt: new Date().toISOString() };
}

module.exports = { fetchWidgetData };
