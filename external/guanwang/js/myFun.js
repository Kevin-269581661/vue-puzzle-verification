/**
 * Created by Administrator on 2017/11/14.
 */
/**
 * 通过id名称获取标签
 * @param id
 * @returns {Element}
 */
function $(id) {
    return document.getElementById(id);
}
// 获取滚动距离
/**
 * 获取滚动距离 scroll().top  scroll().left
 * @returns {*}
 */
function scroll() {
    if(window.pageXOffset || window.pageYOffset){
        // IE9+ 以及最新的浏览器
        var obj = {
            top:window.pageYOffset,
            left:window.pageXOffset
        };
        return obj;
    }else if(document.compatMode == 'CSS1Compat'){
        // 标准模式
        return {
            top:document.documentElement.scrollTop,
            left:document.documentElement.scrollLeft
        }
    }else {
        // 怪异
        return {
            top:document.body.scrollTop,
            left:document.body.scrollLeft
        }
    }
}
/**
 * 获取网页可视区域的宽度和高度
 * 使用 client().width client().height
 * @returns {*}
 */
function client() {
    if(window.innerWidth || window.innerHeight){
        return {
            width:window.innerWidth,
            height:window.innerHeight
        }
    }else if(document.compatMode == 'CSS1Compat'){
        // 标准浏览器
        return {
            width:document.documentElement.clientWidth,
            height:document.documentElement.clientHeight
        }
    }else {
        // 怪异
        return {
            width:document.body.clientWidth,
            height:document.body.clientHeight
        }
    }
}
/**
 * 匀速动画
 * @param obj 要做动画的标签
 * @param speed 速度
 * @param target 目标值
 */
function linear(obj,speed,target) {
    clearInterval(obj.timer);
    var offsetX = obj.offsetLeft;
    var dir = 0;
    if(offsetX < target){
        // 初始值 < 目标值
        dir = speed;
    }else {
        // 初始值 > 目标值
        dir = -speed;
    }

    obj.timer = setInterval(function () {
        offsetX += dir;
        if(Math.abs(target - offsetX) <= speed){
            clearInterval(obj.timer);
            offsetX = target;
        }
        obj.style.left = offsetX + 'px';
        console.log(offsetX,target);
    },10);
}
/**
 * 缓动动画
 * @param obj 要做动画的标签
 * @param data 做动画的数据
 * @param callback 回调函数
 */
function buffer(obj, data,callback) {
    clearInterval(obj.timer);
    var speed = 0;
    var begin = 0;
    var end = 0;
    obj.timer = setInterval(function () {
        // 定义一个标志
        // 规定
        // true 代表所有的值都到达目标值了
        // false 代表有些值没有到达目标值
        var flag = true;
        for(var key in data){
            // 获取标签的原有的位置
            if(key == 'scrollTop'){
                begin = obj.scrollTop;
                end = data[key];
            }else if(key == 'opacity'){
                begin = parseInt(getStyleAttr(obj, key)*100);
                end = data[key] * 100;
            } else {
                begin = parseInt(getStyleAttr(obj, key));
                end = data[key];
            }
            // 速度
            speed = (end - begin) / 10;
            // 判断方向
            speed =  begin < end ? Math.ceil(speed) : Math.floor(speed);
            begin = begin + speed;
            // console.log(speed,begin);

            if(begin == end){
                // 已经到达目标值了
                // 初始值=目标值
            }else {
                // 没有达到目标值
                flag = false;
            }
            if(key == 'scrollTop'){
                obj.scrollTop = begin;
            }else if(key == "opacity"){
                obj.style.opacity = begin/100;
                obj.style.filter = 'alpha(opacity:'+ begin +')';
            }else if(key == "zIndex"){
                obj.style.zIndex = end;
            } else {
                obj.style[key] = begin + 'px';
            }
        }
        // 当所有的值到到达目标之后才清空定时器
        if (flag) {
            // 清空定时器
            clearInterval(obj.timer);
            // 执行回调函数
            if(callback){
                callback();
            }
        }
    }, 20);
}
// 动态获取属性
function getStyleAttr(obj, attr) {
    if (obj.currentStyle) { // IE 和 opera
        return obj.currentStyle[attr];
    } else {
        return window.getComputedStyle(obj, null)[attr];
    }
}

/*
 * 判断浏览器
 */
function getOs() {
    var OsObject = "";
    if (isIE = navigator.userAgent.indexOf("MSIE") != -1) {
        return "MSIE";
    }
    if (isFirefox = navigator.userAgent.indexOf("Firefox") != -1) {
        return "Firefox";
    }
    if (isChrome = navigator.userAgent.indexOf("Chrome") != -1) {
        return "Chrome";
    }
    if (isSafari = navigator.userAgent.indexOf("Safari") != -1) {
        return "Safari";
    }
    if (isOpera = navigator.userAgent.indexOf("Opera") != -1) {
        return "Opera";
    }
}