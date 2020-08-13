import Vue from 'vue'

const preventReClick = function () {
    let openDalay = false
    //不传参点击事件
    Vue.directive('click', function (el, binding) {//不带参数
        el.onclick = function (e) {
            if (openDalay) return;
            openDalay = true
            setTimeout(() => {
                openDalay = false
            }, 1500)
            binding.value()
        }
    })
    Vue.directive('DataClick', function (el, binding) { //带参数
        el.onclick = function (e) {
            if(openDalay) return;
            openDalay = true
            setTimeout(()=>{
                openDalay = false
            },2000);
            // binding.value.func(...binding.value.data)
            console.log("带参数防止重复点击事件的参数是："+ binding.value.data)
            binding.value.func(binding.value.data)
        }
    });
}

export default preventReClick