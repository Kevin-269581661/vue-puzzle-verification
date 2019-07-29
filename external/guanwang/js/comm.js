var  sliderFlag = false;
$(document).ready(function () {
    sliderValidate('submitBtn')
    //video禁止右键
    $('#index_Video').bind('contextmenu',function() { return false; });
    //底部轮播图
    function getOffsetBottom(obj) {
        let h = obj.height();
        let ht = obj.offset().top;
        let wh = $(window).height();
        let xh = wh - (h + ht - $(document).scrollTop());//元素到浏览器底部的高度
        return xh
    };
    $(window).scroll(function () {
        let offsetB = getOffsetBottom($('#demo'))
        if (offsetB >= (-475)) {
            $('.carousel1').find('img').first().addClass('fadeInLeft');
            $('.carousel1').find('img').last().addClass('fadeInUp');
            /* $('.carousel1').find('img').first().removeClass('wow')
             $('.carousel1').find('img').last().removeClass('wow')
             $('.carousel1').find('.right-txt').removeClass('wow')*/
        }
    });
    //视频模态框关闭
    $('#videoModal').on('hide.bs.modal',
        function() {
            let video = $('#index_Video').get(0);
            video.pause()
        })
});