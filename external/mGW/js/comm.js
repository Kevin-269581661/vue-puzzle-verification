$(document).ready(function () {
    showNav();
    new WOW().init();
    var that = $(this);
    //swiper
    var mySwiper = new Swiper('.swiper-video', {
        direction: 'horizontal', // 垂直切换选项
        loop: true, // 循环模式选项
        on: {

        },
        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
        },
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper

        centeredSlides: true,
        spaceBetween: 30,
        slidesPerView: 'auto',
    });
    var mySwiper2 = new Swiper('.swiper-image', {
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
        spaceBetween: 0,
        // initialSlide: 1,
    });

});