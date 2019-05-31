'use strict'
const apiConfig = require('../src/utils/config')


module.exports = {
	NODE_ENV: '"production"',
	EVN_CONFIG:'"prod"',
	API_ROOT: apiConfig.apiRoot.prodURL,
}