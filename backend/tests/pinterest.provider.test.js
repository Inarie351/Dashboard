jest.mock('../src/services/pinterest/client');

const client = require('../src/services/pinterest/client');
const provider = require('../src/services/pinterest/provider');

const CREDENTIALS = { accessToken: 'token-1' };

describe('pinterest provider', () => {
  afterEach(() => jest.clearAllMocks());

  it('fetches and formats the pins on a board', async () => {
    client.getBoardPins.mockResolvedValue({
      items: [
        {
          id: 'pin-1',
          title: 'Cozy living room',
          link: 'https://example.com/pin-1',
          media: { images: { '600x': { url: 'https://img.example.com/pin-1.jpg' } } },
          created_at: '2026-01-01T00:00:00Z',
        },
      ],
    });

    const result = await provider.fetchWidgetData(
      'saved_pins',
      { board_id: 'board-1', count: 5 },
      CREDENTIALS,
    );

    expect(client.getBoardPins).toHaveBeenCalledWith('token-1', 'board-1', 5);
    expect(result.data.boardId).toBe('board-1');
    expect(result.data.pins).toEqual([
      {
        id: 'pin-1',
        title: 'Cozy living room',
        link: 'https://example.com/pin-1',
        imageUrl: 'https://img.example.com/pin-1.jpg',
        createdAt: '2026-01-01T00:00:00Z',
      },
    ]);
  });

  it('fetches board stats', async () => {
    client.getBoard.mockResolvedValue({
      id: 'board-1',
      name: 'Home decor',
      description: 'Ideas for the living room',
      pin_count: 42,
      follower_count: 7,
    });

    const result = await provider.fetchWidgetData(
      'board_stats',
      { board_id: 'board-1' },
      CREDENTIALS,
    );

    expect(client.getBoard).toHaveBeenCalledWith('token-1', 'board-1');
    expect(result.data).toEqual({
      id: 'board-1',
      name: 'Home decor',
      description: 'Ideas for the living room',
      pinCount: 42,
      followerCount: 7,
    });
  });

  it('searches pins by keyword', async () => {
    client.searchPins.mockResolvedValue({
      items: [
        {
          id: 'pin-2',
          title: 'Minimalist bedroom',
          link: 'https://example.com/pin-2',
          media: { images: { '600x': { url: 'https://img.example.com/pin-2.jpg' } } },
          created_at: '2026-02-01T00:00:00Z',
        },
      ],
    });

    const result = await provider.fetchWidgetData(
      'search_pins',
      { query: 'minimalist bedroom', count: 10 },
      CREDENTIALS,
    );

    expect(client.searchPins).toHaveBeenCalledWith('token-1', 'minimalist bedroom', 10);
    expect(result.data.query).toBe('minimalist bedroom');
    expect(result.data.pins).toEqual([
      {
        id: 'pin-2',
        title: 'Minimalist bedroom',
        link: 'https://example.com/pin-2',
        imageUrl: 'https://img.example.com/pin-2.jpg',
        createdAt: '2026-02-01T00:00:00Z',
      },
    ]);
  });

  it('rejects when no Pinterest account is linked', async () => {
    await expect(
      provider.fetchWidgetData('saved_pins', { board_id: 'board-1', count: 5 }, null),
    ).rejects.toMatchObject({ status: 401, message: 'Pinterest account not linked' });
  });

  it('rejects an unknown widget name', async () => {
    await expect(provider.fetchWidgetData('does_not_exist', {}, CREDENTIALS)).rejects.toThrow(
      /Unknown pinterest widget/,
    );
  });
});
