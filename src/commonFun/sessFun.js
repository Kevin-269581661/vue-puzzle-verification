//1.引入vue
import Vue from 'vue';
import router from "../router";
//2.新创建一个vue实例
let sessVue = new Vue();
let sess = {};
sess.getSess = function () {
    return JSON.parse(sessionStorage.getItem("session_data"));
}
sess.loginTimeout = function () {
    console.log('sessVue',sessVue)
    sessVue.$message.warning("登录超时,请重新登录")
    router.push("/login")
}
// 操作提示统一方法
sess.messageFun = function (mesType, mes) {
    sessVue.$message({
        message: mes,
        type: mesType,
        showClose: true,
    })
}
export default sess;
