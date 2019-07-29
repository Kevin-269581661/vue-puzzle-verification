
var sliderFlag = false;
$(document).ready(function () {
    sliderValidate('submitBtn');
    changeDoor();
    lineActive();
    changeVideo();
    videoControl();

    //video禁止右键
    function videoControl() {
        $('#index_Video').bind('contextmenu', function () {
            return false;
        });
        $('#appVideo').bind('contextmenu', function () {
            return false;
        });
        $('#rlVideo').bind('contextmenu', function () {
            return false;
        });
        $('#xcxVideo').bind('contextmenu', function () {
            return false;
        });
        $('#nfcVideo').bind('contextmenu', function () {
            return false;
        });
        $('#smVideo').bind('contextmenu', function () {
            return false;
        });
        // $('#index_Video').get(0).currentTime = 0.1;
    }

    function getOffsetBottom(obj) {
        let h = obj.height();
        let ht = obj.offset().top;
        let wh = $(window).height();
        let xh = wh - (h + ht - $(document).scrollTop());//元素到浏览器底部的高度
        return xh
    }

//动态线
    function lineActive() {
        $(window).scroll(function () {
            let bf = getOffsetBottom($('.line1-wrap'));
            if (bf > 0) {
                $('.line1-wrap').find('.line1').height('70px');
                setTimeout(function () {
                    $('.line1-wrap').find('.line2').css('width', '73px')
                    $(window).unbind('scroll');
                }, 300)
            }
        });
        $('.tix-box1').siblings().hide()
        $('.dot1').click(function () {
            $('.line2-wrap').find('.line2').width('0');
            setTimeout(function () {
                $('.line2-wrap').find('.line1').height('0');
            }, 300);
            $('.line4-wrap').find('.line2').width('0');
            setTimeout(function () {
                $('.line4-wrap').find('.line1').height('0');
            }, 300);
            $('.line3-wrap').find('.line2').width('0');
            setTimeout(function () {
                $('.line3-wrap').find('.line1').height('0');
            }, 300);
            //当前
            $('.line1-wrap').find('.line1').height('70px');
            setTimeout(function () {
                $('.line1-wrap').find('.line2').css('width', '80px')
            }, 300);
            $('.txt-box1').css({display: 'block'}).removeClass('fadeOutUp').addClass('animated fadeInUp').siblings().addClass('fadeOutUp')

        });
        $('.dot2').click(function () {
            $('.line4-wrap').find('.line2').width('0');
            setTimeout(function () {
                $('.line4-wrap').find('.line1').height('0');
            }, 300);
            $('.line1-wrap').find('.line2').width('0');
            setTimeout(function () {
                $('.line1-wrap').find('.line1').height('0');
            }, 300);
            $('.line3-wrap').find('.line2').width('0');
            setTimeout(function () {
                $('.line3-wrap').find('.line1').height('0');
            }, 300);
            //当前
            $('.line2-wrap').find('.line1').height('70px');
            setTimeout(function () {
                $('.line2-wrap').find('.line2').css('width', '100px')
            }, 300)
            //当前box
            $('.txt-box2').css({display: 'block'}).removeClass('fadeOutUp').addClass('animated fadeInUp').siblings().addClass('fadeOutUp')
        });
        $('.dot3').click(function () {
            $('.line2-wrap').find('.line2').width('0');
            setTimeout(function () {
                $('.line2-wrap').find('.line1').height('0');
            }, 300);
            $('.line4-wrap').find('.line2').width('0');
            setTimeout(function () {
                $('.line4-wrap').find('.line1').height('0');
            }, 300);
            $('.line1-wrap').find('.line2').width('0');
            setTimeout(function () {
                $('.line1-wrap').find('.line1').height('0');
            }, 300);
            //当前
            $('.line3-wrap').find('.line1').height('185px');
            setTimeout(function () {
                $('.line3-wrap').find('.line2').css('width', '305px')
            }, 300)
            $('.txt-box3').css({display: 'block'}).removeClass('fadeOutUp').addClass('animated fadeInUp').siblings().addClass('fadeOutUp')
        });
        $('.dot4').click(function () {
            $('.line2-wrap').find('.line2').width('0');
            setTimeout(function () {
                $('.line2-wrap').find('.line1').height('0');
            }, 300);
            $('.line1-wrap').find('.line2').width('0');
            setTimeout(function () {
                $('.line1-wrap').find('.line1').height('0');
            }, 300);
            $('.line3-wrap').find('.line2').width('0');
            setTimeout(function () {
                $('.line3-wrap').find('.line1').height('0');
            }, 300);
            //当前
            $('.line4-wrap').find('.line1').height('258px');
            setTimeout(function () {
                $('.line4-wrap').find('.line2').css('width', '305px')
            }, 300)
            $('.txt-box4').css({display: 'block'}).removeClass('fadeOutUp').addClass('animated fadeInUp').siblings().addClass('fadeOutUp')
        });
    }

//tab切换
    function changeVideo() {
        $('.tabs-tab').find('li').click(function () {
            $(this).addClass('active').siblings().removeClass('active')
            let index = $(this).index();
            // console.log(index);
            // $('.line').animate({left: 173 * index + 'px'})
            $('.tabs-line').animate({left: 120 * (index) + 'px'})
            $('.box').eq(index).show().siblings().hide();
            $('.box').eq(index).addClass('fadeInUp').siblings().removeClass('fadeInUp')
            let video = document.getElementsByTagName('video')
            $('#appVideo').get(0).pause();
            $('#smVideo').get(0).pause();
            $('#rlVideo').get(0).pause();
            $('#xcxVideo').get(0).pause();
            $('#nfcVideo').get(0).pause();
            $('.player_img').show()
        });
        playVideo()

    }

//门切换
    function changeDoor() {
        var index1 = 0, index2;
        $('#right-tab-ol').find('li').click(function () {
            console.log($(this).index());
            index1 = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $(this).parent().siblings('.line').animate({
                marginLeft: 70 + 110 * index1 + 'px'
            });
            $(this).parent().siblings('#right-tab-ul').find('li').eq(index1).slideDown().siblings().hide();
            //图片
            $(this).parents('.right-tab').siblings('.left-door').find('#left-door-ul').children('li').eq(index1).css('display', 'flex').siblings().css('display', 'none')

        });
        $('#right-tab-ul').find('dl').click(function () {
            $(this).addClass('active').siblings().removeClass('active');
            index2 = $(this).index();
            // console.log(index1,index2);
            $(this).parents('.right-tab').siblings('.left-door').find('#left-door-ul').children('li').eq(index1).find('.left-door-ul-ul').children('li').eq(index2).css('display', 'flex').removeClass('fadeOutUp').addClass('fadeInUp').siblings().css('display', 'none').removeClass('fadeInUp').addClass('fadeOutUp')
        })


    }

//视频播放
    function playVideo() {
        $('.player_img').click(function () {
            // let video = document.getElementById('xcxVideo')
            let video = $(this).siblings().get(0);
            let player = $(this)
            video.play()
            player.fadeOut()
            video.addEventListener('ended', function () {
                video.currentTime = 0;
                player.fadeIn()
            });
        });
    };

//视频模态框关闭
    $('#videoModal').on('hide.bs.modal',
        function () {
            let video = $('#index_Video').get(0);
            video.pause()
        });

//覆盖高端社区
    $('.slider-wrap').hover(function () {
        $('.slider-wrap-btn').fadeIn('fast')
    }, function () {
        $('.slider-wrap-btn').fadeOut('fast')
    });

//高度完善
    $('.left-tabs').find('li').click(function () {
        $(this).addClass('active').siblings().removeClass('active')
        let index = $(this).index() - 1
        $('.left-line').animate({top: 85 * index + 'px'})
        $('.right-content-li').eq(index).show().siblings().hide()
        $('.right-content-li').eq(index).addClass('animated fadeInUp').siblings().removeClass('fadeInUp')

    });


//知名品牌
    $('.part5-content-pics').find('li').each(function () {
        let index = $(this).index();
        $(this).css('backgroundImage', 'url("images/itlgCommunity/property/marketing_sixth_baoli_normal' + index + '_0.png")')
    });
    $('.part5-content-pics').find('li').hover(function () {
        let index = $(this).index();
        $(this).css({
            backgroundImage: 'url("images/itlgCommunity/property/marketing_sixth_baoli_normal' + index + '_1.png")',
            boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.10)'
        })

    }, function () {
        let index = $(this).index();
        $(this).css({
            backgroundImage: 'url("images/itlgCommunity/property/marketing_sixth_baoli_normal' + index + '_0.png")',
            boxShadow: 'none'
        })
    });

})