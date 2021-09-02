import Vue from 'vue';

let directives = {};
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
