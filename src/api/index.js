/**
 * 请求统一封装模块
 */

// 扫描目录导入模块
const apiModel = {}
const requireAll = require.context('./modules', true, /\.api\.js$/)
requireAll.keys().forEach(filePath => {
  const module = filePath.replace(/.*\.\/(.+)\.api\.js$/, '$1')
  apiModel[module] = requireAll(filePath)
  // apiModel[module] = requireAll(filePath).default
})
console.log('apiModel ===', apiModel)
export default apiModel
