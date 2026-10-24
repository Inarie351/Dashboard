const client = require('./client');

function formatPin(pin) {
  return {
    id: pin.id,
    title: pin.title || pin.grid_title || null,
    link: pin.link || null,
    imageUrl: pin.media?.images?.['600x']?.url || pin.media?.images?.original?.url || null,
    createdAt: pin.created_at || null,
  };
}

const handlers = {
  saved_pins: async (config, credentials) => {
    const raw = await client.getBoardPins(credentials.accessToken, config.board_id, config.count);
    return { boardId: config.board_id, pins: (raw.items || []).map(formatPin) };
  },
  board_stats: async (config, credentials) => {
    const raw = await client.getBoard(credentials.accessToken, config.board_id);
    return {
      id: raw.id,
      name: raw.name,
      description: raw.description || null,
      pinCount: raw.pin_count,
      followerCount: raw.follower_count,
    };
  },
  search_pins: async (config, credentials) => {
    const raw = await client.searchPins(credentials.accessToken, config.query, config.count);
    return { query: config.query, pins: (raw.items || []).map(formatPin) };
  },
};

async function fetchWidgetData(widgetName, config, credentials) {
  const handler = handlers[widgetName];
  if (!handler) {
    const err = new Error(`Unknown pinterest widget "${widgetName}"`);
    err.status = 400;
    throw err;
  }
  if (!credentials?.accessToken) {
    const err = new Error('Pinterest account not linked');
    err.status = 401;
    throw err;
  }
  const data = await handler(config, credentials);
  return { data, fetchedAt: new Date().toISOString() };
}

module.exports = { fetchWidgetData };
