import Vue from 'vue'
import App from './App.vue'
import router from './router';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Global from './tool/Global'
import store from './store';
import util from './tool/util'

Vue.use(ElementUI);

Vue.config.productionTip = false;
// 全局工具
Vue.prototype.Global = Global;
Vue.prototype.util = util;
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
