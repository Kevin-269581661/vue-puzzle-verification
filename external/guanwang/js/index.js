var  sliderFlag = false;
$(document).ready(function () {
    browserRedirect();
    function browserRedirect() {
        var timestamp=new Date().getTime();
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if ((bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) ){
            window.location.href="http://m.qinlinkeji.com";
        }
    }
//video禁止右键
    $('#index_Video').bind('contextmenu',function() { return false; });
    $('#index_nav').find('li').click(function () {
        $(this).addClass('active').siblings().removeClass('active')
    });
    $('.box-wrap').find('.imgs-wrap').hover(function () {
        $(this).siblings().find('.up-txt').removeClass('fadeInDown').addClass('animated fadeOutUp');
        $(this).siblings().find('.down-txt').removeClass('fadeOutDown').addClass('animated fadeInUp');
    },function () {
        $(this).siblings().find('.up-txt').removeClass('fadeOutUp').addClass('fadeInDown');
        $(this).siblings().find('.down-txt').removeClass('fadeInUp').addClass('fadeOutDown');
    });
//视频模态框关闭
    $('#videoModal').on('hide.bs.modal',
        function() {
            let video = $('#index_Video').get(0);
            video.pause();
        })
    sliderValidate('submitBtn');
})