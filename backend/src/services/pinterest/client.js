const axios = require('axios');
const { withRetry } = require('../httpClient');

const API_URL = 'https://api.pinterest.com/v5';

function authHeaders(accessToken) {
  return { Authorization: `Bearer ${accessToken}` };
}

async function getBoard(accessToken, boardId) {
  const { data } = await withRetry(() =>
    axios.get(`${API_URL}/boards/${boardId}`, { headers: authHeaders(accessToken) }),
  );
  return data;
}

async function getBoardPins(accessToken, boardId, count) {
  const { data } = await withRetry(() =>
    axios.get(`${API_URL}/boards/${boardId}/pins`, {
      headers: authHeaders(accessToken),
      params: { page_size: count },
    }),
  );
  return data;
}

async function searchPins(accessToken, query, count) {
  const { data } = await withRetry(() =>
    axios.get(`${API_URL}/search/pins`, {
      headers: authHeaders(accessToken),
      params: { query, page_size: count },
    }),
  );
  return data;
}

module.exports = { getBoard, getBoardPins, searchPins };
