/*function submitForm(id,sliderFlag) {

}*/

;function subfun() {
    // alert('dianji')
    let type = parseInt($('#role').val())
    if ($('#companyName').val() != '' && $('#linkMan').val() != '' && $('#city').val() != '' && $('#phone').val() != '' && $('#email').val() != '' && $('#content').val() != '') {
        let info = {
            business_name: $('#companyName').val(),
            name: $('#linkMan').val(),
            city_name: $('#city').val(),
            phone: $('#phone').val(),
            email: $('#email').val(),
            content: $('#content').val(),
            type: type
        };
        $.ajax({
            url : 'https://shop2.qlkeji.cn/admin/potential/client/add',
            data : info,
            type : 'post',
            async : true,
            dataType : 'json',
            success : function(res) {
                alert('留言成功');
                $('#companyName').val('')
                $('#linkMan').val('')
                $('#city').val('')
                $('#phone').val('')
                $('#email').val('')
                $('#content').val('')
            },
            error : function() {
                alert('留言失败');
            }
        });
        // console.log(info);
    }else{
        alert('请完善表单信息')
    }
}
;function showNav() {
    $('.header-nav').on('touchstart',function () {
        $('.nav-mask').toggleClass('show');
        $('.nav-list').slideToggle();
    });
    $('.nav-mask').on('touchstart',function () {
        $(this).removeClass('show');
        $('.nav-list').slideUp();
    });
    $('.nav-list').find('a').on('touchstart',function (e) {
        e.stopPropagation()
    });

}
//IOS10以上
;function mvp() {
    //禁止双手缩放
    document.documentElement.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, false);
    //  禁止手指双击缩放
    var lastTouchEnd = 0;
    document.documentElement.addEventListener('touchend', function (event) {
        var now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}
//数字自增到某一值动画参数（目标元素,自定义配置）
;function NumAutoPlusAnimation(targetEle, options) {
    /*可以自己改造下传入的参数，按照自己的需求和喜好封装该函数*/
    //不传配置就把它绑定在相应html元素的data-xxxx属性上吧
    options = options || {};

    let $this = document.getElementById(targetEle),
        time = options.time || $this.data('time'), //总时间--毫秒为单位
        finalNum = options.num || $this.data('value'), //最终数值
        regulator = options.regulator || 100, //调速器，改变regulator的数值可以调节数字改变的速度
        step = finalNum / (time / regulator), /*每30ms增加的数值--*/
        count = options.count || 0, //计数器
        initial = 0;

    let timer = setInterval(function () {
        count = count + step;
        if (count >= finalNum) {
            clearInterval(timer);
            count = finalNum;
        }
        //t未发生改变的话就直接返回
        //避免调用text函数，提高DOM性能
        let t = Math.floor(count);
        if (t < 2) {
            t = count.toFixed(2);
        } else {
            t = Math.floor(count)
        }

        if (t == initial) return;
        initial = t;
        $this.innerText = initial;
    }, 30);
}
; function getOffsetBottom(obj) {
    let h = obj.height();
    let ht = obj.offset().top;
    let wh = $(window).height();
    let xh = wh - (h + ht - $(document).scrollTop());//元素到浏览器底部的高度
    return xh
}


