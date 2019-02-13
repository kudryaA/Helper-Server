'use strict';

const fs = require('fs');
const yaml = require('yaml');

const configurationFile = fs.readFileSync('./configuration.yml', 'utf8');
const configuration = yaml.parse(configurationFile);

exports.port = configuration.port;
exports.database = configuration.database;
exports.password = configuration.password;
exports.files = configuration.files;