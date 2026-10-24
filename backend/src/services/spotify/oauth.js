// Spotify OAuth2 Authorization Code flow — same manual pattern as services/github/oauth.js.
const axios = require('axios');
const jwt = require('jsonwebtoken');
const {
  spotifyClientId,
  spotifyClientSecret,
  spotifyOauthCallbackUrl,
  jwtSecret,
} = require('../../config/env');

const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SCOPE = 'user-top-read user-read-currently-playing';

function basicAuthHeader() {
  const basic = Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString('base64');
  return { Authorization: `Basic ${basic}` };
}

function buildAuthorizeUrl(userId) {
  const state = jwt.sign({ sub: userId }, jwtSecret, { expiresIn: '10m' });
  const params = new URLSearchParams({
    client_id: spotifyClientId,
    response_type: 'code',
    redirect_uri: spotifyOauthCallbackUrl,
    scope: SCOPE,
    state,
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

function verifyState(state) {
  try {
    return jwt.verify(state, jwtSecret).sub;
  } catch {
    const err = new Error('Invalid or expired OAuth state');
    err.status = 400;
    throw err;
  }
}

function toCredentials(data, fallbackRefreshToken) {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || fallbackRefreshToken || null,
    expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : null,
  };
}

async function exchangeCodeForToken(code) {
  const { data } = await axios.post(
    TOKEN_URL,
    new URLSearchParams({
      code,
      redirect_uri: spotifyOauthCallbackUrl,
      grant_type: 'authorization_code',
    }),
    { headers: basicAuthHeader() },
  );
  return toCredentials(data);
}

async function refreshAccessToken(refreshToken) {
  const { data } = await axios.post(
    TOKEN_URL,
    new URLSearchParams({ refresh_token: refreshToken, grant_type: 'refresh_token' }),
    { headers: basicAuthHeader() },
  );
  // Spotify doesn't always re-issue a refresh_token on refresh — keep the one we already have.
  return toCredentials(data, refreshToken);
}

module.exports = { buildAuthorizeUrl, verifyState, exchangeCodeForToken, refreshAccessToken };
