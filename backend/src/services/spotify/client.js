// Every widget in this service is authenticated with the logged-in user's own OAuth access token
// — a user token can read public artist data just fine, so account_stats/latest_releases work the
// same way as top_content/now_playing, just against public endpoints.
const axios = require('axios');
const { withRetry } = require('../httpClient');

const API_URL = 'https://api.spotify.com/v1';

function authHeaders(accessToken) {
  return { Authorization: `Bearer ${accessToken}` };
}

async function getAccountStats(accessToken, artistId) {
  const { data } = await withRetry(() =>
    axios.get(`${API_URL}/artists/${artistId}`, { headers: authHeaders(accessToken) }),
  );
  return {
    name: data.name,
    followers: data.followers?.total ?? 0,
    secondary: { label: 'Popularity', value: data.popularity },
  };
}

async function getLatestReleases(accessToken, artistId, count) {
  const { data } = await withRetry(() =>
    axios.get(`${API_URL}/artists/${artistId}/albums`, {
      headers: authHeaders(accessToken),
      params: { include_groups: 'album,single', limit: 50 },
    }),
  );
  const sorted = [...data.items].sort(
    (a, b) => new Date(b.release_date) - new Date(a.release_date),
  );
  return {
    items: sorted.slice(0, count).map((album) => ({
      title: album.name,
      date: album.release_date,
      url: album.external_urls?.spotify,
    })),
  };
}

async function getTopContent(accessToken, timeRange) {
  const { data } = await withRetry(() =>
    axios.get(`${API_URL}/me/top/tracks`, {
      headers: authHeaders(accessToken),
      params: { time_range: timeRange || 'medium_term', limit: 10 },
    }),
  );
  return {
    items: data.items.map((track) => ({
      title: `${track.name} — ${track.artists.map((a) => a.name).join(', ')}`,
      metric: `popularity ${track.popularity}`,
    })),
  };
}

async function getNowPlaying(accessToken, showProgress) {
  const { data } = await withRetry(() =>
    axios.get(`${API_URL}/me/player/currently-playing`, {
      headers: authHeaders(accessToken),
      validateStatus: (status) => status === 200 || status === 204,
    }),
  );
  // Spotify returns 204 with an empty body when nothing is currently playing.
  if (!data || !data.item) {
    return { isPlaying: false };
  }
  const result = {
    isPlaying: data.is_playing,
    title: data.item.name,
    artist: data.item.artists.map((a) => a.name).join(', '),
  };
  if (showProgress) {
    result.progressMs = data.progress_ms;
    result.durationMs = data.item.duration_ms;
  }
  return result;
}

module.exports = { getAccountStats, getLatestReleases, getTopContent, getNowPlaying };
