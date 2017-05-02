import Vue from 'vue'

Vue.directive('scroll', {
    bind: function(el, binding, vnode) {
        console.log(binding.value);
        let html = '<div id="item" style="height:16px;overflow:hidden;">';
        binding.value.forEach(function(item) {
            html += '<div>' + item.name + '</div>';
        })
        binding.value.forEach(function(item) {
            html += '<div>' + item.name + '</div>';
        })
        html += '</div>';
        el.innerHTML = html;
    },

    inserted: function(el) {
        let scroll = new Vue({
            el: '#item'
        })
        let count = 1;

        function countTime() {
            count++;
            if (count == 100) {
                scroll.$el.scrollTop++;
                count = 1;
            }
        }
        function up() {
            if ((scroll.$el.scrollTop < scroll.$el.scrollHeight / 2) && (scroll.$el.scrollTop % 16 != 0)) {
                scroll.$el.scrollTop++;
            } else if ((scroll.$el.scrollTop < scroll.$el.scrollHeight / 2) && (scroll.$el.scrollTop % 16 == 0))
                countTime();
            else {
               scroll.$el.scrollTop=0;
            }
        }
        setInterval(up, 50);
    },
    update: function(el, binding) {
    	console.log(binding.value);
    	  let html = '<div id="item" style="height:16px;overflow:hidden;">';
        binding.value.forEach(function(item) {
            html += '<div>' + item.name + '</div>';
        })
        binding.value.forEach(function(item) {
            html += '<div>' + item.name + '</div>';
        })
        html += '</div>';
        el.innerHTML = html;


    },
    componentUpdated: function(el, binding) {

    },
    unbind: function(el, binding) {

    }
})
