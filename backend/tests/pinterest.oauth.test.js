jest.mock('axios');

const axios = require('axios');
const {
  buildAuthorizeUrl,
  verifyState,
  exchangeCodeForToken,
  refreshAccessToken,
} = require('../src/services/pinterest/oauth');

describe('pinterest oauth', () => {
  afterEach(() => jest.clearAllMocks());

  it('embeds a state that resolves back to the same user id', () => {
    const url = buildAuthorizeUrl('user-42');
    const state = new URL(url).searchParams.get('state');

    expect(verifyState(state)).toBe('user-42');
  });

  it('rejects a tampered state', () => {
    expect(() => verifyState('not-a-valid-jwt')).toThrow(/Invalid or expired OAuth state/);
  });

  it('exchanges a code for an access token with expiry', async () => {
    axios.post.mockResolvedValue({
      data: { access_token: 'pina_abc', refresh_token: 'pinr_abc', expires_in: 3600 },
    });

    const credentials = await exchangeCodeForToken('code-1');

    expect(credentials.accessToken).toBe('pina_abc');
    expect(credentials.refreshToken).toBe('pinr_abc');
    expect(new Date(credentials.expiresAt).getTime()).toBeGreaterThan(Date.now());
  });

  it('refreshes an access token, keeping the old refresh token if none is reissued', async () => {
    axios.post.mockResolvedValue({ data: { access_token: 'pina_new', expires_in: 3600 } });

    const credentials = await refreshAccessToken('pinr_old');

    expect(credentials.accessToken).toBe('pina_new');
    expect(credentials.refreshToken).toBe('pinr_old');
  });
});
