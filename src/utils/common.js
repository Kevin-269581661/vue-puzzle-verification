/**
 * 导出文件
 * @param {*} data 二进制流
 * @param {*} fileName
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
  link.setAttribute('download', fileName + '.' + suffix)
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

export {
  // 下载文件
  downLoadFile,
  // 安全解析 josn
  deserialize,
}
