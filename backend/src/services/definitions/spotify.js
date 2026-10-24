const { registerService } = require('../widgetRegistry');
const catalog = require('../spotify/catalog');

registerService('spotify', catalog);
