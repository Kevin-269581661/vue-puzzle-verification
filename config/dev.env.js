'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const apiConfig = require('../src/utils/config')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    EVN_CONFIG: '"dev"',
    API_ROOT: apiConfig.apiRoot.devURL
})
