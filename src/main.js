import Vue from 'vue'
import App from './App.vue'
import VueClipboard from 'vue-clipboard2'

VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
