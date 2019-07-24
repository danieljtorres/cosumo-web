import Vue from 'vue'
import CreateDeviceForm from './components/CreateDeviceForm.vue'
import CreateUserForm from './components/CreateUserForm.vue'
import EditDeviceForm from './components/EditDeviceForm.vue'
import EditUserForm from './components/EditUserForm.vue'
import CreateHireForm from './components/CreateHireForm.vue'
import EditHireForm from './components/EditHireForm.vue'
window.Vue = Vue

Vue.config.productionTip = false

const app = new Vue({
    el: '#app',
    components: {
        CreateDeviceForm,
        CreateUserForm,
        CreateHireForm,
        EditDeviceForm,
        EditUserForm,
        EditHireForm
    }
})