// Widget metadata only — feeds services/definitions/clock.js, which registers it with the
// widget registry so it shows up in GET /about.json. Fetch logic lives in provider.js.
// No external account needed: this service just reads the server's own clock.
module.exports = [
  {
    name: 'digital_clock',
    description: 'Current time in a given timezone, shown as digits',
    params: [{ name: 'timezone', type: 'string' }],
  },
  {
    name: 'analog_clock',
    description: 'Current time in a given timezone, shown as an analog clock face',
    params: [{ name: 'timezone', type: 'string' }],
  },
  {
    name: 'timer',
    description: 'A countdown timer of a chosen duration, with start, pause and reset',
    params: [
      { name: 'label', type: 'string' },
      { name: 'minutes', type: 'integer' },
      { name: 'seconds', type: 'integer' },
    ],
  },
];
