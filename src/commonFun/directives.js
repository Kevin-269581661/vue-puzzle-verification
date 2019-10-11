
import Vue from 'vue';

let directives = {};
// 事件埋点
directives.qadnMtaH5 = Vue.directive('qadnMtaH5',{
    bind( el, binding ) {
        el.addEventListener('click',()=>{
            console.log('-------1',binding)
            MtaH5.clickStat(binding.value.id)
        })
    }
})

export default directives;

