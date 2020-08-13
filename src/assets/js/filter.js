
import Vue from 'vue'

const filter = function(){
    Vue.filter('keeptwoNum', function (value) {
        value = Number(value)
        return value.toFixed(2)
    })
    Vue.filter('keeponeNum', function (value) {
        value = Number(value)
        return value.toFixed(1)
    })
    Vue.filter('percentageNum', function (value) {
        value = Number(value)
        return value.toFixed(0)
    })
    Vue.filter('integerNum', function (value) {
        value = Number(value).toFixed(2).toString().split('.')
        return value[0]
    })
    Vue.filter('decimalNum', function (value) {
        value = Number(value).toFixed(2).toString().split('.')
        return value[1]
    })
}

export default filter       
