var settings = {};
settings.cache_dir = __dirname + '/.cache/';
settings.token_file = settings.cache_dir + '.axotoken';
settings.info_file = __dirname + '/.axoinfo';
settings.account = require('./account');
module.exports = settings;