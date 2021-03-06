import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "@/store"
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import axios from 'axios'
import * as d3 from 'd3'

Vue.prototype.$d3 = d3;
window.d3 = d3;


const my_tag_list = [];
const my_editableTabsValue = { "active-tab": '' };

Vue.prototype.$my_tag_list = my_tag_list;
Vue.prototype.$my_editableTabsValue = my_editableTabsValue;
// 配置请求的跟路径
//axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.config.productionTip = false
Vue.prototype.$ajax = axios
new Vue({
    router,

    store,
    render: h => h(App)
}).$mount('#app')
