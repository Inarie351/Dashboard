const { registerService } = require('../widgetRegistry');
const catalog = require('../pinterest/catalog');

registerService('pinterest', catalog);
