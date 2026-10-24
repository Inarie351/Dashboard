jest.mock('../src/services/spotify/client');

const client = require('../src/services/spotify/client');
const provider = require('../src/services/spotify/provider');

describe('spotify provider', () => {
  afterEach(() => jest.clearAllMocks());

  it("fetches a followed artist's stats", async () => {
    client.getAccountStats.mockResolvedValue({ name: 'Some Artist', followers: 10 });

    const result = await provider.fetchWidgetData(
      'account_stats',
      { artist_id: 'artist-1' },
      { accessToken: 'BQC_abc' },
    );

    expect(client.getAccountStats).toHaveBeenCalledWith('BQC_abc', 'artist-1');
    expect(result.data.name).toBe('Some Artist');
  });

  it("fetches an artist's latest releases", async () => {
    client.getLatestReleases.mockResolvedValue({ items: [{ title: 'Album' }] });

    const result = await provider.fetchWidgetData(
      'latest_releases',
      { artist_id: 'artist-1', count: 5 },
      { accessToken: 'BQC_abc' },
    );

    expect(client.getLatestReleases).toHaveBeenCalledWith('BQC_abc', 'artist-1', 5);
    expect(result.data.items).toHaveLength(1);
  });

  it("fetches the logged-in user's top tracks for a time range", async () => {
    client.getTopContent.mockResolvedValue({
      items: [{ title: 'Song — Artist', metric: 'popularity 80' }],
    });

    const result = await provider.fetchWidgetData(
      'top_content',
      { time_range: 'short_term' },
      { accessToken: 'BQC_abc' },
    );

    expect(client.getTopContent).toHaveBeenCalledWith('BQC_abc', 'short_term');
    expect(result.data.items).toHaveLength(1);
  });

  it("fetches the logged-in user's currently playing track", async () => {
    client.getNowPlaying.mockResolvedValue({ isPlaying: true, title: 'Song', artist: 'Artist' });

    const result = await provider.fetchWidgetData(
      'now_playing',
      { show_progress: 0 },
      { accessToken: 'BQC_abc' },
    );

    expect(client.getNowPlaying).toHaveBeenCalledWith('BQC_abc', 0);
    expect(result.data.isPlaying).toBe(true);
  });

  it('rejects when the user has not linked a Spotify account', async () => {
    await expect(provider.fetchWidgetData('now_playing', {}, {})).rejects.toThrow(
      /Spotify account not linked/,
    );
  });

  it('rejects an unknown widget name', async () => {
    await expect(
      provider.fetchWidgetData('does_not_exist', {}, { accessToken: 'BQC_abc' }),
    ).rejects.toThrow(/Unknown spotify widget/);
  });
});
