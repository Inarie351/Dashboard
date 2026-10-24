const provider = require('../src/services/clock/provider');

describe('clock provider', () => {
  it('reads the current time in a given timezone for the digital clock', async () => {
    const result = await provider.fetchWidgetData('digital_clock', { timezone: 'UTC' });

    expect(result.data.timezone).toBe('UTC');
    expect(result.data.hours).toBeGreaterThanOrEqual(0);
    expect(result.data.hours).toBeLessThanOrEqual(23);
    expect(result.data.minutes).toBeGreaterThanOrEqual(0);
    expect(result.data.weekday).toEqual(expect.any(String));
    expect(result.fetchedAt).toEqual(expect.any(String));
  });

  it('reads the same shape of data for the analog clock', async () => {
    const result = await provider.fetchWidgetData('analog_clock', { timezone: 'Europe/Paris' });

    expect(result.data.timezone).toBe('Europe/Paris');
    expect(result.data.seconds).toBeGreaterThanOrEqual(0);
  });

  it('rejects an unknown timezone', async () => {
    await expect(
      provider.fetchWidgetData('digital_clock', { timezone: 'Not/A_Timezone' }),
    ).rejects.toThrow(/Unknown timezone/);
  });

  it('turns the timer duration into seconds', async () => {
    const result = await provider.fetchWidgetData('timer', {
      label: 'Pasta',
      minutes: 9,
      seconds: 30,
    });

    expect(result.data).toEqual({ label: 'Pasta', durationSeconds: 570 });
  });

  it.each([
    [{ minutes: 0, seconds: 0 }, /longer than 0 seconds/],
    [{ minutes: 5, seconds: 60 }, /seconds between 0 and 59/],
    [{ minutes: -1, seconds: 10 }, /minutes must be between/],
    [{ minutes: 24 * 60 + 1, seconds: 0 }, /minutes must be between/],
  ])('rejects an invalid timer duration %o', async (duration, message) => {
    await expect(
      provider.fetchWidgetData('timer', { label: 'Tea', ...duration }),
    ).rejects.toMatchObject({ status: 400, message: expect.stringMatching(message) });
  });

  it('rejects an unknown widget name', async () => {
    await expect(provider.fetchWidgetData('does_not_exist', {})).rejects.toThrow(
      /Unknown clock widget/,
    );
  });
});
