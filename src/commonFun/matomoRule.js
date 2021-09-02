/*
 * 监听点击事件
 * path 页面路径
 * text 标签值
 */
// main.js 导入时触发
(function () {
    try {
        sessionStorage.setItem("matomoUrl", {
            dev: "https://test-matomo.qinlindmp.com/",
            test: "https://test-matomo.qinlindmp.com/",
            gray: "https://matomo.qinlinad.com/",
            prod: "https://matomo.qinlinad.com/",
        }[process.env.EVN_CONFIG]);
    } catch (error) {
        console.warn("获取web服务环境：", error);
    }
})();
// 上报点击事件
function eventClickFun(e) {
    try {
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
        text && text.indexOf('\n') == -1 && _paq.push(["trackEvent", "click", JSON.stringify(matomoPushData), "点击事件"]);
    } catch (error) {
        console.warn("点击事件埋点：", error);
    }
}
// 上报路由事件
function emitRouteEvent(to, from) {
    try {
        let {
            asName = "", uType = "", username = ""
        } = JSON.parse(sessionStorage.getItem("session_data")) || {};
        _paq.push(["trackEvent", "route", JSON.stringify({
            asName,
            uType,
            username,
            from: from.path || "",
            to: to.path || ""
        }), "页面跳转"]);
    } catch (error) {
        console.warn("页面跳转埋点：", error);
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
    document.documentElement.addEventListener('click', eventClickFun, true);
}
export function emitRouteEvent(to, from) {
    try {
        let {
            asName = "", uType = "", username = ""
        } = JSON.parse(sessionStorage.getItem("session_data")) || {};
        _paq.push(["trackEvent", "route", JSON.stringify({
            asName,
            uType,
            username,
            from: from.path || "",
            to: to.path || ""
        }), "页面跳转"]);
    } catch (error) {
        console.warn("页面跳转埋点：", error);
    }
}
