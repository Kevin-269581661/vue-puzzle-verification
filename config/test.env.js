
'use strict'
const apiConfig = require('../src/utils/config')


module.exports = {
	NODE_ENV: '"testing"',
	EVN_CONFIG: '"test"',
	API_ROOT: apiConfig.apiRoot.testURL
}