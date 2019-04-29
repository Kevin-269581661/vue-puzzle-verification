// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
    install(Vue, options) {
        Vue.prototype.getPdf = function (idName, topSize) {
            const loading =  this.$loading({
                lock: true,
                text: '全力加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            if(topSize==0){
                this.isDisble = true; 
            }else{
                this.isImgDis = true;
            }
            let title = this.htmlTitle;
            let that = this;
            html2Canvas(document.querySelector(idName), {
                allowTaint: true
            }).then(function (canvas) {
                // 1920--12--44
                // 1366--10--34
                // 第一种方法-----
                let top = 12 
                console.log('screen-----------', screen.width);
                if(screen.width ==1920){
                    top = 12;
                }
                if(screen.width == 1366){
                    top = 10;
                }
                if(topSize == 0){
                    top = -3;
                }
                let contentWidth = canvas.width
                let contentHeight = canvas.height
                let pageHeight = contentWidth / (592.28-top) * 841.89
                let leftHeight = contentHeight
                // let position = 0
                let position = top
                let imgWidth = 595.28
                let imgHeight = (592.28-top) / contentWidth * contentHeight
                let pageData = canvas.toDataURL('image/jpeg', 1.0)
                let PDF = new JsPDF('', 'pt', 'a4')
                if (leftHeight < pageHeight) {
                    PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
                } else {
                    while (leftHeight > 0) {
                        PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                        leftHeight -= pageHeight
                        position -= 841.89
                        if (leftHeight > 0) {
                            PDF.addPage()
                        }
                    }
                }
                PDF.save(title + '.pdf')
                loading.close();
                if(topSize==0){
                    that.isDisble = false; 
                }else{
                    that.isImgDis = false;
                }
                // // 第二种方式：
                // let contentWidth = canvas.width;
                // let contentHeight = canvas.height;

                // //一页pdf显示html页面生成的canvas高度;
                // let pageHeight = contentWidth / 592.28 * 841.89;
                // //未生成pdf的html页面高度
                // let leftHeight = contentHeight;
                // //页面偏移
                // let position = 0;
                // //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                // let imgWidth = 595.28;
                // let imgHeight = 592.28/contentWidth * contentHeight;

                // let pageData = canvas.toDataURL('image/jpeg', 1.0);

                // let pdf = new jsPDF('', 'pt', 'a4');

                // //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                // //当内容未超过pdf一页显示的范围，无需分页
                // if (leftHeight < pageHeight) {
                //     pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
                // } else {
                //     while(leftHeight > 0) {
                //         pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                //         leftHeight -= pageHeight;
                //         position -= 841.89;
                //         //避免添加空白页
                //         if(leftHeight > 0) {
                //             pdf.addPage();
                //         }
                //     }
                // }
                // pdf.save(title + '.pdf')

            }
            )
        }
    }
}