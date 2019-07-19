/*function submitForm(id,sliderFlag) {

}*/

;function subfun() {
    // alert('dianji')
    // console.log('点击提交按钮', sliderFlag);
    let box = $(".drag").get(0),//容器
        bg = $(".slider-bg").get(0),//背景
        text = $(".slider-text").get(0),//文字
        btn = $(".slider-btn").get(0);//滑块
    let type = parseInt($('input:radio:checked').val())
    if ($('#companyName').val() != '' && $('#linkMan').val() != '' && $('#city').val() != '' && $('#phone').val() != '' && $('#email').val() != '' && $('#content').val() != '') {
        if (sliderFlag == false) {
            alert('请拖动滑块验证信息')
        } else {
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
            /**$.post('http://shop.qlkeji.cn/admin/potential/client/add', info, function (res) {
                if (res.data.code == 1) {
                    //成功
                    alert(res.data.msg)
                } else {
                    //失败
                    alert(res.data.msg)
                }
            })**/
        }

    } else {
        alert('请先完善表单信息')
        if (sliderFlag) {
            //重置滑块
            // console.log('请先完善表单信息！');
            sliderFlag = false
            btn.style.left = 0;
            bg.style.width = 0;
            btn.style.transition = "left 1s ease";
            bg.style.transition = "width 1s ease";
            btn.style.background = '#fff url("images/index/hk_arr.png") no-repeat center'
            btn.style.backgroundSize = '17px 17px'
            btn.style.color = "#666";
            text.innerHTML = "请拖动滑块验证";
            text.style.color = '#000';
            sliderValidate('submitBtn', sliderFlag)
            // alert('请先完善表单信息！')
            // console.log('sliderFlag！', sliderFlag);
            return false
        }
    }

}

//滑块验证
;function sliderValidate() {
    let box = $(".drag").get(0),//容器
        bg = $(".slider-bg").get(0),//背景
        text = $(".slider-text").get(0),//文字
        btn = $(".slider-btn").get(0),//滑块
        success = false,//是否通过验证的标志
        distance = box.offsetWidth - btn.offsetWidth;//滑动成功的宽度（距离）
    //点击提交按钮


    //二、给滑块注册鼠标按下事件
    btn.onmousedown = function (e) {
        // console.log('按下');
        // console.log(sliderFlag);
        //1.鼠标按下之前必须清除掉后面设置的过渡属性
        btn.style.transition = "";
        bg.style.transition = "";
        //说明：clientX 事件属性会返回当事件被触发时，鼠标指针向对于浏览器页面(或客户区)的水平坐标。
        //2.当滑块位于初始位置时，得到鼠标按下时的水平位置
        var e = e || window.event;
        var downX = e.clientX;
        //三、鼠标移动事件
        document.onmousemove = function (e) {
            // console.log('移动')
            var e = e || window.event;
            //1.获取鼠标移动后的水平位置
            var moveX = e.clientX;

            //2.得到鼠标水平位置的偏移量（鼠标移动时的位置 - 鼠标按下时的位置）
            var offsetX = moveX - downX;

            //3.在这里判断一下：鼠标水平移动的距离 与 滑动成功的距离 之间的关系
            if (offsetX > distance) {
                offsetX = distance;//如果滑过了终点，就将它停留在终点位置
            } else if (offsetX < 0) {
                offsetX = 0;//如果滑到了起点的左侧，就将它重置为起点位置
            }
            //4.根据鼠标移动的距离来动态设置滑块的偏移量和背景颜色的宽度
            btn.style.left = offsetX + "px";
            bg.style.width = offsetX + "px";

            //如果鼠标的水平移动距离 = 滑动成功的宽度
            if (offsetX == distance) {
                //1.设置滑动成功后的样式
                text.innerHTML = "验证通过";
                text.style.color = "#fff";
                // btn.innerHTML = "√";
                btn.style.backgroundColor = '#fff';
                btn.style.backgroundImage = 'url("images/index/hk_success.png")';
                btn.style.backgroundRepeat = 'no-repeat';
                btn.style.backgroundPosition = 'center';
                btn.style.backgroundSize = '17px 17px'
                bg.style.backgroundColor = "#95d253";

                //2.设置滑动成功后的状态
                success = true;
                //成功后，清除掉鼠标按下事件和移动事件（因为移动时并不会涉及到鼠标松开事件）
                btn.onmousedown = null;
                document.onmousemove = null;

                //3.成功解锁后的回调函数

                // console.log('成功');
                sliderFlag = true
            }
        };

        //四、给文档注册鼠标松开事件
        document.onmouseup = function (e) {

            //如果鼠标松开时，滑到了终点，则验证通过
            if (success) {
                return;
            } else {
                //反之，则将滑块复位（设置了1s的属性过渡效果）
                btn.style.left = 0;
                bg.style.width = 0;
                btn.style.transition = "left 1s ease";
                bg.style.transition = "width 1s ease";
            }
            //只要鼠标松开了，说明此时不需要拖动滑块了，那么就清除鼠标移动和松开事件。
            document.onmousemove = null;
            document.onmouseup = null;
        }


    }
}

