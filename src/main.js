import Vue from 'vue';
// Plugins
import Message from '@/plugins/message/message';
import Storage from '@/plugins/storage';
import Bus from '@/plugins/bus';
import Util from '@/plugins/util';
import Service from '@/plugins/service';
import Datetime from '@/plugins/datetime';
import Progress from '@/plugins/progress-bar/progress';
import Loading from '@/plugins/loading/loading';
import Modal from '@/plugins/modal/modal';
import App from './App.vue';
import router from './router';
import store from './store';
import Components from './plugins/component';
import vuetify from './plugins/vuetify';
import './assets/index.scss';
import './scss/index.scss';

Vue.use(Progress);
Vue.use(Message);
Vue.use(Storage);
Vue.use(Bus);
Vue.use(Modal);
Vue.use(Loading);
Vue.use(Components);
Vue.use(Datetime);
Vue.use(Util);
Vue.use(Service, {
  apiUrl: process.env.VUE_APP_API_URL,
  baseServer: process.env.VUE_APP_BASE_SERVER,
  authToken: process.env.VUE_APP_AUTH_TOKEN,
  filterResponse: (response, Message) => {
    if (response.datos && response.finalizado) {
      return response.datos;
    }
    if ('finalizado' in response && !response.finalizado) {
      Message.error(response.message);
      return response.datos;
    }
    return response;
  },
  errorFormat: 'mensaje'
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
