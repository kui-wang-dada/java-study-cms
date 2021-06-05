import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/zh-CN'; // lang i18n

import '@/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';
import 'utils/global-utils';

import '@/icons'; // icon
import '@/permission'; // permission control

import * as filters from './filters';

import SrmTable from '@/components/SrmTable';
import SrmForm from '@/components/SrmForm';
import SrmDialogCheck from '@/components/SrmDialogCheck';

// mavonEditor
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import 'mavon-editor/dist/markdown/github-markdown.min.css';
Vue.use(mavonEditor);

//引入axios
import axios from 'axios';

//定义$axios（可以不写，在组件中直接使用axios）
Vue.prototype.$axios = axios;

Vue.use(ElementUI, {
  locale,
  size: 'small'
});

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.component('SrmForm', SrmForm);
Vue.component('SrmTable', SrmTable);
Vue.component('SrmDialogCheck', SrmDialogCheck);

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
