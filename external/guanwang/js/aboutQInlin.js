var sliderFlag = false;
$(document).ready(function () {
    sliderValidate('submitBtn');
    //video禁止右键
    $('#index_Video').bind('contextmenu', function () {
        return false;
    });

    //数字自增到某一值动画参数（目标元素,自定义配置）
    function NumAutoPlusAnimation(targetEle, options) {
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

    function getOffsetBottom(obj) {
        let h = obj.height();
        let ht = obj.offset().top;
        let wh = $(window).height();
        let xh = wh - (h + ht - $(document).scrollTop());//元素到浏览器底部的高度
        return xh
    }

    //数字
    $(window).scroll(function () {
        let bf = getOffsetBottom($('.content-tags-wrap'));
        if (bf > -200) {
            let myTimer1 = setTimeout(function () {
                NumAutoPlusAnimation("cityNum", {
                    time: 1800,
                    num: 110,
                    regulator: 60
                });
                NumAutoPlusAnimation("coopNum", {
                    time: 1800,
                    num: 850,
                    regulator: 60
                });
                NumAutoPlusAnimation("communityNum", {
                    time: 1800,
                    num: 25000,
                    regulator: 60
                });
                NumAutoPlusAnimation("personNum", {
                    time: 1800,
                    num: 3.47,
                    count: 0.01,
                    regulator: 60
                });
                NumAutoPlusAnimation("communityDoor", {
                    time: 1800,
                    num: 100000,
                    regulator: 60
                });
                NumAutoPlusAnimation("mediaCost", {
                    time: 1800,
                    num: 80,
                    regulator: 60
                });
                clearTimeout(myTimer1)
                // $(window).unbind('scroll');
            }, 300)
        }
        if (bf > -202) {
            // console.log(1);
            $(window).unbind('scroll');
            openInterval(1)
        }
    });
    let myTimer;

    function openInterval(i) {
        clearInterval(myTimer);
        myTimer = setInterval(function () {
            i++;
            if (i > 15) {
                i = 0
            }
            $('.tip-box' + i).stop(true, true).fadeIn('slow').siblings().fadeOut('slow');
            $('.dot' + i).css('opacity', 0.3).siblings().css('opacity', 0);
        }, 3000);

    }

    $('.dot').click(function () {
        clearInterval(myTimer);
        i = $(this).index() + 1;
        $('.tip-box' + i).stop(true, true).fadeIn('slow').siblings().fadeOut('slow');
        $('.dot' + i).css('opacity', 0.3).siblings().css('opacity', 0);
        openInterval(i)
    });

    //产品专利轮播图 获取当前active的li
    var box = document.getElementById('slider-zl');
    var slider_ctl = box.children[1];
    var oul = box.children[0];
    var list = oul.children;
    var spans = slider_ctl.children;
    var txts = $('.zl-info').find('li').get();
    // false 没有点击
    // true 点击了
    var isClick = false;
    let dataArr = [
        {   //9
            width: 182,
            height: 255,
            left: (-182),
            zIndex: 2
        },
        {  // 4
            width: 182,
            height: 255,
            left: 0,
            zIndex: 3
        },
        {   //5
            width: 202,
            height: 284,
            left: 182,
            zIndex: 4
        },
        {   //6
            width: 230,
            height: 325,
            left: (202 + 182),
            zIndex: 5
        },
        {   //7
            width: 202,
            height: 284,
            left: (202 + 182 + 230),
            zIndex: 4
        },
        {   //8
            width: 182,
            height: 255,
            left: (202 + 182 * 2 + 230 + 20),
            zIndex: 3
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },
        {   //9
            width: 182,
            height: 255,
            left: (202 + 182 * 3 + 230 + 20),
            zIndex: 2
        },

    ];
    let txtArr = [
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 1},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
        {opacity: 0},
    ];
    //初始位置
    changePosition();

    // 更改位置
    function changePosition() {
        for (var i = 0; i < list.length; i++) {
            var li = list[i];
            let txt = txts[i]
            buffer(li, dataArr[i], function () {
                isClick = false;
            });
            buffer(txt, txtArr[i], function () {
                isClick = false;
            });
        }
    }

    // 4.监听点击
    for (var i = 0; i < spans.length; i++) {
        var span = spans[i];
        span.onclick = function () {
            if (isClick == true) return;
            isClick = true;
            if (this.className == 'left-btn') {
                // 点击了左边
                // 把第一张图变成最后一张，即把第五组数据放到最前面
                dataArr.push(dataArr.shift());
                txtArr.push(txtArr.shift());
                changePosition();
            } else if (this.className == "right-btn") {
                // 点击了右边
                // 删除最后一个 添加到第一个
                var ele = dataArr.pop();
                var ele2 = txtArr.pop();
                dataArr.unshift(ele);
                txtArr.unshift(ele2);
                changePosition();
            }
        }
    }
    //视频模态框关闭
    $('#videoModal').on('hide.bs.modal', function () {
        let video = $('#index_Video').get(0)
        video.pause()
    });
    //奖项
    let myTimer2;
    let ind = 0;

    function award() {
        $('.right-box').find('ul li').click(function () {
            ind = $(this).index()
            // console.log(ind)
            clearInterval(myTimer2);
            setTimeout(function () {
                awardInterval()
            }, 1000);
            $(this).addClass('active').siblings().removeClass('active');

            $('.left-box').find('.i').eq(ind).css('display', 'flex').removeClass('fadeOutUp').addClass('animated fadeInUp').siblings().css('display', 'none').removeClass('fadeInUp').addClass('animated fadeOutUp')
        });
        awardInterval()
    }

    function awardInterval() {
        clearInterval(myTimer2);
        let s = 0
        myTimer2 = setInterval(function () {
                let h = $('.right-box').find('ul li').eq(ind).height() + 20
                ind++;
                // console.log(ind)
                s += h
                // console.log(h,s);
                if (ind > 12) {
                    $(".right-box").animate({scrollTop:0});
                    ind = 0;
                    s=0

                } else {
                    $(".right-box").animate({scrollTop:s});
                }

                $('.right-box').find('li').eq(ind).addClass('active').siblings().removeClass('active');
                $('.left-box').find('.i').eq(ind).css('display', 'flex').removeClass('fadeOutUp').addClass('animated fadeInUp').siblings().css('display', 'none').removeClass('fadeInUp').addClass('animated fadeOutUp');

            }, 3000)

    }

    award()
})