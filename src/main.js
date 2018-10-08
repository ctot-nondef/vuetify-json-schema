import Vue from 'vue';
import App from './app';

Vue.config.productionTip = false;

Vue.use({
  tagName: 'svgicon',
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
});
