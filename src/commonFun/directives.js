import Vue from 'vue';

let directives = {};
let userInfo = JSON.parse(sessionStorage.getItem('session_data'))
// 事件埋点
directives.qadnMtaH5 = Vue.directive('qadnMtaH5', {
    bind(el, binding) {
        el.addEventListener('click', () => {
            console.log('-------1', binding)
            MtaH5.clickStat(binding.value.id)
        })
    }
})

directives.preventReClick = Vue.directive('preventReClick', {
    inserted: function (el, binding) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                console.log("preventReClick")
                setTimeout(() => {
                    el.disabled = false
                }, binding.value || 500)
            }
        })
    }
})

export default directives;
