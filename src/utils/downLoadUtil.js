/**
 * 下载相关-工具方法
 */

/**
 * 下载导出文件（二进制流）
 * @param {*} data 二进制流
 * @param {*} fileName 必传-文件名，可带或不带后缀
 * @param {*} etc 非必传-文件后缀，带不带点都可
 */
async function downLoadFileByBlob(data, fileName, etc = 'xlsx') {
  // 去除文件名空格
  fileName = fileName.replace(/\s+/g, '')
  // 检查文件名是否带有后缀
  const fileNameDotIndex = fileName.lastIndexOf('.')
  if (fileNameDotIndex !== -1) {
    etc = fileName.slice(fileNameDotIndex + 1)
    fileName = fileName.slice(0, fileNameDotIndex)
  }
  // 去掉后缀的“.”
  const suffix = etc.startsWith('.') ? etc.slice(1) : etc
  if (fileName.indexOf('.') === -1) fileName += `.${suffix}`
  const blob = new Blob([data])
  const href = window.URL.createObjectURL(blob)
  downLoadFileByLink(href, fileName)
  // 释放掉blob对象
  window.URL.revokeObjectURL(href)
}

/**
 * 通过 a 标签下载文件（触发浏览器自动下载）
 * 需要同源！
 * 如果没有指定值，浏览器会从多个来源决定文件名和扩展名：
 * - Content-Disposition HTTP 标头
 * - URL 路径的最后一段
 * - 媒体类型。来自 Content-Type 标头，data: URL 的开头，或 blob: URL 的 Blob.type。
 * https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a
 * @param {*} href
 * @param {*} fileName
 */
async function downLoadFileByLink(href, fileName = '') {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = href
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 处理下载文件接口返回 response（二进制流）
 */
async function downLoadFileByRes(res, fileName = '') {
  // 如果没有设置文件名，自动读取接口返回文件名
  if (!fileName && res.headers['content-disposition']) {
    fileName = window.decodeURI(res.headers['content-disposition'].split('=')[1])
    if (fileName.lastIndexOf(';') > -1) {
      fileName.slice(fileName.lastIndexOf(';') + 1)
    }
  }
  if (!fileName) fileName = '文件'
  // 检查文件名是否有类型后缀
  if (fileName.indexOf('.') === -1 && res.headers['content-type']) {
    fileName += getFileSuffix(res.headers['content-type'])
  }
  await downLoadFileByBlob(res.data, fileName)
}

/**
 * 使用 iframe 下载文件（触发浏览器自动下载）
 * 部分类型有效！
 */
async function downLoadFileByIframe(src) {
  const iframeEl = document.createElement('iframe')
  iframeEl.src = src
  iframeEl.style.display = 'none'
  document.body.appendChild(iframeEl)
}

/**
 * 通过链接下载文件（Fetch 请求，可带参，大文件不推荐使用此方法，会占用较多内存！）
 */
async function downLoadFileByUrl(url, fileName = '') {
  // 如果没有设置文件名，获取链接上的文件名
  if (!fileName) fileName = url.split('/').pop()
  const res = await window.fetch(url)
  if (!res.ok) throw new Error('下载文件失败')
  // 检查文件名是否有类型后缀
  const contentType = res.headers.get('content-type')
  if (fileName.indexOf('.') === -1 && contentType) {
    fileName += getFileSuffix(contentType)
  }
  const blob = await res.arrayBuffer()
  await downLoadFileByBlob(blob, fileName)
}

/**
 * 根据 content-type 获取文件后缀
 * https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 */
function getFileSuffix(contentType) {
  let etc = ''
  if (/sheet/i.test(contentType)) {
    etc = '.xlsx'
  } else if (/excel/i.test(contentType)) {
    etc = '.xls'
  } else if (/msword/i.test(contentType)) {
    etc = '.doc'
  } else if (/wordprocessingml/i.test(contentType)) {
    etc = '.docx'
  } else if (/pdf/i.test(contentType)) {
    etc = '.pdf'
  } else if (/svg/i.test(contentType)) {
    etc = `.svg`
  } else if (/x-abiword/i.test(contentType)) {
    etc = '.abw'
  } else if (/x-freearc/i.test(contentType)) {
    etc = '.arc'
  } else if (/x-msvideo/i.test(contentType)) {
    etc = '.avi'
  } else if (/ebook/i.test(contentType)) {
    etc = '.azw'
  } else if (/octet-stream/i.test(contentType)) {
    etc = '.bin'
  } else if (/microsoft\.icon/i.test(contentType)) {
    etc = '.ico'
  } else if (/plain/i.test(contentType)) {
    etc = '.txt'
  } else if (/tar/i.test(contentType)) {
    etc = '.tar'
  } else {
    etc = `.${contentType.split('/')[1]}`
  }
  return etc
}

export {
  // 处理下载文件接口返回 response（二进制流）
  downLoadFileByRes,
  // 下载导出文件（二进制流）
  downLoadFileByBlob,
  // 通过链接下载文件（Fetch 请求，可带参，大文件不推荐使用此方法，会占用较多内存！）
  downLoadFileByUrl,
  // 通过 a 标签下载文件（触发浏览器自动下载）
  downLoadFileByLink,
  // 使用 iframe 下载文件（触发浏览器自动下载）
  downLoadFileByIframe
}
