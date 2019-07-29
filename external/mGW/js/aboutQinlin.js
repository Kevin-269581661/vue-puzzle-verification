$(document).ready(function () {
    showNav();

    //懒加载
    $("img").lazyload({
        //图片在距离屏幕 200 像素时提前加载
        threshold: 200,
        effect: "fadeIn"
    });

    //专利
    var swiper = new Swiper('.zhuanli-swiper', {
        direction: 'horizontal', // 垂直切换选项
        loop: true, // 循环模式选项
        slidesPerView: 'auto',
        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
        },
        lazy: true,
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper
        centeredSlides: true,
        spaceBetween: 10,
        initialSlide: 2,
        // slidesPerView: 3,
        on: {
            slideChangeTransitionEnd: function () {
                let i = this.activeIndex - 34
                if (i == 34) {
                    i = 0
                }else if(i<0){
                    i = 33
                }
                // console.log(this.activeIndex,i);
                $('.txt').eq(i).fadeIn('fast').siblings().fadeOut('fast')
            },
        },

    });
    //奖项

    var swiper2 = new Swiper('.swiper-award', {
        slidesPerView: 'auto',
        spaceBetween: 10,
        centeredSlides: true,
        loop: true, // 循环模式选项
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    $(window).scroll(function () {
        let bf = getOffsetBottom($('.content-tags-wrap'));
        // console.log(bf);
        if (bf > -600) {
            let myTimer1 = setTimeout(function () {
                NumAutoPlusAnimation("cityNum", {
                    time: 2000,
                    num: 110,
                    regulator: 60
                });
                NumAutoPlusAnimation("coopNum", {
                    time: 2000,
                    num: 850,
                    regulator: 60
                });
                NumAutoPlusAnimation("communityNum", {
                    time: 2000,
                    num: 25000,
                    regulator: 60
                });
                NumAutoPlusAnimation("personNum", {
                    time: 2000,
                    num: 3.47,
                    count: 0.01,
                    regulator: 60
                });
                NumAutoPlusAnimation("communityDoor", {
                    time: 2000,
                    num: 100000,
                    regulator: 60
                });
                NumAutoPlusAnimation("mediaCost", {
                    time: 2000,
                    num: 80,
                    regulator: 60
                });
                clearTimeout(myTimer1)
                // $(window).unbind('scroll');
            }, 300)
        }
        if (bf > -601) {
            $(window).unbind('scroll');
        }
    });

});