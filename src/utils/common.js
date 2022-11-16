// 导出excel
export function downLoadFile (data, fileName, etc = '.xlsx') {
    const link = document.createElement('a')
    let blob = new Blob([data], {
      type: 'application/vnd.ms-excel;charset=utf-8'
    })
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', fileName + etc)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
