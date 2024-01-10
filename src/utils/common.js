
import axios from 'axios';

/**
 * 通过 Ajax 下载文件
 * @param {*} url
 * @returns
 */
async function downloadFileByUrl(url) {
  if (!/^http.+\.\w+$/.test(url)) {
    return console.error('URL 必须以 http/https 开头，以文件名+后缀结尾');
  }
  const res = await axios({
    method: 'get',
    url,
    responseType: 'blob',
  })
  let fileName = ''
  if (res.headers['content-disposition']) {
    fileName = window.decodeURI(res.headers['content-disposition'].split('=')[1], "UTF-8");
    if (fileName.lastIndexOf(';') > -1) {
      fileName.slice(fileName.lastIndexOf(';') + 1)
    }
  } else {
    fileName = url.split('/').pop();
  }
  console.log('fileName ===', fileName)
  await downLoadFile(res.data.data, fileName)
}
/**
 * 通过 iframe 下载文件
 * @param {*} fileUrl
 */
async function downloadFileByIframe(fileUrl) {
  try {
    const elemIF = document.createElement('iframe')
    elemIF.src = fileUrl
    elemIF.style.display = 'none'
    document.body.appendChild(elemIF)
  } catch (e) {
    console.warn('文件下载：', e)
  }
}
/**
 * 导出文件
 * @param {*} data 二进制流
 * @param {*} fileName 可带或不带后缀
 * @param {*} etc 文件后缀，带不带点都可
 */
async function downLoadFile (data, fileName, etc = 'xlsx') {
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
  let blob = null
  if (suffix in TypeObj) {
    blob = new Blob([data], {
      type: TypeObj[suffix]
    })
  } else {
    blob = new Blob([data])
  }
  const link = document.createElement('a')
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
  // 通过 iframe 下载文件
  downloadFileByIframe,
  // 通过链接下载文件
  downloadFileByUrl,
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
