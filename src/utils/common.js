
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
  await downLoadFile(res.data, fileName)
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
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
    'xls': 'application/vnd.ms-excel;charset=utf-8',
    'doc': 'application/msword;charset=utf-8',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8',
    'pdf': 'application/pdf;charset=utf-8',
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
/**
 * 文件预览（支持 Excel、Word、PPT、图片等）
 * 此方法借助了第三方网站，打开新窗口预览（也可以使用 iframe 嵌套在当前页面）
 * 注意：重要文件不可使用该方法！！！存在安全泄密问题！！！使用前请三思
 */
function previewFile(url) {
  const newUrl = url.split('?')[0]
  const etc = newUrl.slice(newUrl.lastIndexOf('.') + 1)
  let openUrl = ''
  if (['pptx', 'ppt', 'xlsx', 'xls', 'doc', 'docx'].includes(etc)) {
    // word官方预览链接（支持三种格式，部分word带特殊符号或流程图无法显示）
    // openUrl = `https://view.xdocin.com/view?src=${encodeURIComponent(url)}`
    // office官方预览（pdf不能展示）
    openUrl = `http://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`
  } else {
    openUrl = url
  }
  window.open(openUrl, '_blank')
}

/**
 * 获取通过 value 获取 下拉数据 的 label
 */
function getLabel(value, options = [], config) {
  const { labelKey = 'label', valueKey = 'value' } = config || {}
  const current = options.find((item) => item[valueKey] === value)
  return current ? current[labelKey] : ''
}

/**
 * 处理标签样式列
 */
function getTagList(val, splitChar = ',') {
  val = deserialize(val)
  if (!val) return []
  return typeof val === 'string' ? val.split(splitChar) : val
}

/**
 * 检测数据的类型
 *
 * @param {*} data
 * @returns 返回类型字符串： string number boolean undefined null object function array date regExp object
 */
const checkType = (data) => {
  let type = Object.prototype.toString.call(data)
  type = type.slice(8, type.length - 1)
  return type.toLowerCase()
}
/**
 * 判断是否是空数组，空对象，空字符串
 *
 * @param {*} value
 * @returns true false
 */
const isEmpty = (value) => {
  let isEmptyVal = false
  const type = checkType(value)
  switch (type) {
    case 'array':
      if (value.length === 0) isEmptyVal = true
      break
    case 'object':
      // if (JSON.stringify(value) === '{}') isEmptyVal = true
      if (Object.keys(value).length === 0) isEmptyVal = true
      break
    case 'string':
      if (value === '') isEmptyVal = true
      break
    case 'undefined':
      isEmptyVal = true
      break
    case 'null':
      isEmptyVal = true
      break
    default:
  }
  return isEmptyVal
}
/**
 * 检测是否是不为空数组，空对象，空字符串，null
 *
 * @param {*} value
 * @returns true false
 */
const isNotEmpty = (value) => {
  return !isEmpty(value)
}

export {
  checkType,
  isEmpty,
  isNotEmpty,
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
  getUniqueId,
  // 文件预览（支持 Excel、Word、PPT、图片等）
  previewFile,
  // 获取通过 value 获取 下拉数据 的 label
  getLabel,
  // 处理标签样式列
  getTagList
}
