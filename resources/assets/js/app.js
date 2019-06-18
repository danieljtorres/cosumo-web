import Vue from 'vue'
import CreateDeviceForm from './components/CreateDeviceForm.vue'
import EditDeviceForm from './components/EditDeviceForm.vue'
import CreateHireForm from './components/CreateHireForm.vue'
window.Vue = Vue

Vue.config.productionTip = false

const app = new Vue({
    el: '#app',
    components: {
        CreateDeviceForm,
        CreateHireForm,
        EditDeviceForm
    }
})