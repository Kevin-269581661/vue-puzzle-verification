/**
 * 导出文件
 * @param {*} data 二进制流
 * @param {*} fileName 可带或不带后缀
 * @param {*} etc 文件后缀，带不带点都可
 */
function downLoadFile (data, fileName, etc = 'xlsx') {
  let suffix = etc.lastIndexOf('.') > -1 ? etc.slice(etc.lastIndexOf('.') + 1) : etc
  const TypeObj = {
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'xls': 'application/vnd.ms-excel',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'pdf': 'application/pdf',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed'
  }
  const link = document.createElement('a')
  let blob = new Blob([data], {
    type: TypeObj[suffix]
  })
  let href = window.URL.createObjectURL(blob)
  link.style.display = 'none'
  link.href = href
  if (fileName.indexOf('.') === -1) {
    fileName += '.' + suffix
  }
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  // 释放掉blob对象
  window.URL.revokeObjectURL(href)
}
/**
 * 安全解析 josn
 * @param val 任何可能是 json 的值
 * @returns 解析后的值
 */
function deserialize(val) {
  let data = null
  try {
    data = JSON.parse(val)
  } catch (e) {
    data = val || undefined
  }
  return data
}
/**
 * 复制文本到剪切板
 * @param {String} text
 */
async function setClipboardData(text) {
  let val = String(text)
  if (navigator.clipboard && navigator.permissions) {
    return await navigator.clipboard.writeText(val)
  } else {
    // 兼容旧浏览器
    const textArea = document.createElement('textArea')
    textArea.value = val
    textArea.style.width = 0
    // 解决 Safari 浏览器中，点击复制按钮，整个页面会跳动一下
    textArea.style.position = 'fixed'
    textArea.style.left = 0
    textArea.style.top = 0
    textArea.style.transform = 'translate(-100%, -100%)'
    textArea.setAttribute('readonly', 'readonly')
    document.body.appendChild(textArea)
    textArea.select()
    let result = document.execCommand("copy")
    document.body.removeChild(textArea)
    if (!result) {
      throw new Error('复制失败')
    }
  }
}
/**
 * 获取 url 上的参数，转换成对象
 */
function getUrlParams(url) {
  let paramsObj = {}
  if (!url || typeof url !== 'string') return paramsObj
  const urlParamArr = url.split('?')
  if (urlParamArr.length <= 1) return paramsObj
  urlParamArr
    .pop()
    .split('&')
    .forEach((item) => {
      const [key, value] = item.split('=')
      paramsObj[key] = value
    })
  return paramsObj
}
/**
 * 得到一个唯一id
 */
const getUniqueId = (function () {
  let id = 0
  return function () {
    return Math.random().toString(36).slice(3, 6) + Number(`${Date.now()}${++id}`).toString(36)
  }
})()

export {
  // 下载文件
  downLoadFile,
  // 安全解析 josn
  deserialize,
  // 复制文本到剪切板
  setClipboardData,
  // 获取 url 上的参数，转换成对象
  getUrlParams,
  // 得到一个唯一id
  getUniqueId
}
