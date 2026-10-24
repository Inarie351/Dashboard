// Widget metadata only — feeds services/definitions/pinterest.js. Every widget here is
// authenticated with the logged-in user's own linked Pinterest account (OAuth).
module.exports = [
  {
    name: 'saved_pins',
    description: 'Latest pins saved on a board',
    params: [
      { name: 'board_id', type: 'string' },
      { name: 'count', type: 'integer' },
    ],
  },
  {
    name: 'board_stats',
    description: "A board's name, description, pin count and follower count",
    params: [{ name: 'board_id', type: 'string' }],
  },
  {
    name: 'search_pins',
    description: 'Pins matching a keyword search, independent of any one board',
    params: [
      { name: 'query', type: 'string' },
      { name: 'count', type: 'integer' },
    ],
  },
];
