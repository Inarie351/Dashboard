// Widget metadata only — feeds services/definitions/spotify.js. Every widget here is
// authenticated with the logged-in user's own linked Spotify account (OAuth).
module.exports = [
  {
    name: 'account_stats',
    description: 'Followers of a followed artist',
    params: [{ name: 'artist_id', type: 'string' }],
  },
  {
    name: 'latest_releases',
    description: 'Latest titles/singles released by an artist',
    params: [
      { name: 'artist_id', type: 'string' },
      { name: 'count', type: 'integer' },
    ],
  },
  {
    name: 'top_content',
    description: "The logged-in user's most listened tracks over a period",
    params: [{ name: 'time_range', type: 'string' }],
  },
  {
    name: 'now_playing',
    description: "The logged-in user's currently playing track",
    params: [{ name: 'show_progress', type: 'integer' }],
  },
];
