
import Vue from 'vue';

let directives = {};
directives.qadnMtaH5 = Vue.directive('qadnMtaH5',{
    bind( el, binding ) {
        el.addEventListener('click',()=>{
            console.log('-------1',binding)
            // MtaH5.clickStat('事件ID')
        })
    }
})

export default directives;

