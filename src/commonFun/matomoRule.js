/*
 * 监听点击事件
 * path 页面路径
 * text 标签值
 */

// 上报事件
function eventClickFun(e) {
    // 获取缓存中的值
    let {
        asName = "", uType = "", username = ""
    } = JSON.parse(sessionStorage.getItem("session_data")) || {};
    // 兼容性处理
    let num = 3;
    let event = e || window.event;
    let target = event.target || event.srcElement;
    let text = getEventText(target, num); // 获取标签中的所有文本
    let path = event.srcElement.baseURI //获取当前页面url
    let tag = target.localName
    let matomoPushData = {
        asName,
        uType,
        username,
        text,
        path,
        tag
    }
    // 上报事件
    try {
        text && text.indexOf('\n') == -1 && _paq.push(["trackEvent", "click", JSON.stringify(matomoPushData)]);
    } catch (error) {
        console.warn(error)
    }
}

// 通过递归查找父级标签是否有值

function getEventText(target, num) {
    let text = ""
    if (target.innerText) {
        text = target.innerText
    } else {
        if (num > 0) getEventText(target.parentNode, num--)
    }
    text = text.slice(0, 16)
    return text
}

window.onload = function () {
    document.documentElement.addEventListener('click', eventClickFun);
}
