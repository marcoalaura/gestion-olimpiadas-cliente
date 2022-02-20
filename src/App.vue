<template>
  <v-app>
    <app-navbar v-if="['/login', '/home', '/reportes', '/clasificados', '/medalleros'].includes($route.path)"></app-navbar>
    <app-sidenav v-if="['/reportes', '/clasificados', '/medalleros'].includes($route.path)"></app-sidenav>
    <v-main v-if="main" :class="['/login'].includes($route.path) ? 'main--content' : ''">
      <div :class="getClasses()" style="width: 100%" class="main">
        <transition :name="transitionName" mode="out-in">
          <router-view />
        </transition>
      </div>
    </v-main>
    <app-confirm />
    <app-alert />
    <app-loading />
    <app-messages />
    <app-progress />
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import AppProgress from '@/plugins/progress-bar/AppProgress.vue';
import AppConfirm from '@/plugins/modal/AppConfirm.vue';
import AppAlert from '@/plugins/modal/AppAlert.vue';
import AppLoading from '@/plugins/loading/AppLoading.vue';
import AppMessages from '@/plugins/message/AppMessages.vue';
import Auth from '@/components/auth/mixins/auth';
import routes from '@/router/routes';
import AppNavbar from './layout/AppNavbar.vue';
import AppSidenav from './layout/AppSidenav.vue';

// Páginas que no necesitan autenticación/token/sesión
const PageNoLogin = ['login', 'reportes', 'clasificados', 'medalleros'];

export default {
  name: 'App',
  mixins: [Auth],
  components: {
    AppProgress,
    AppConfirm,
    AppAlert,
    AppLoading,
    AppMessages,
    AppNavbar,
    AppSidenav
  },
  created() {
    // window.addEventListener('beforeunload', this.beforeWindowUnload);
    if (this.$storage.existUser()) {
      this.$store.commit('setAuth', true);

      if (this.$storage.exist('sidenav')) {
        this.$store.commit('setSidenav', this.$storage.get('sidenav'));
      }
    }
  },
  data() {
    return {
      transitionName: ''
    };
  },
  mounted() {
    // this.setTheme();
    // this.page404();
  },
  methods: {
    getClasses() {
      let className = '';
      if (['xs', 'sm'].includes(this.$vuetify.breakpoint.name)) {
        className = '';
      }
      if (!['xs', 'sm'].includes(this.$vuetify.breakpoint.name)) {
        className = 'pl-5 pr-5';
      }
      if (['/home', '/reportes'].includes(this.$route.path)) {
        className += ' d-flex flex-row align-center justify-center';
      }
      if (['/reportes'].includes(this.$route.path)) {
        className += ' h100';
      }
      if (this.$route.path === '/login') {
        className += ' d-flex flex-row align-center justify-center isLogin';
      }
      return className;
    },
    setTheme() {
      this.$vuetify.theme.dark = this.$storage.get('theme') || this.$vuetify.theme.dark;
      this.$storage.set('theme', this.$vuetify.theme.dark);
    },
    page404(to) {
      const routeNames = [...routes.map(item => item.path), '/'];
      const path = to || this.$route.path;
      if (!routeNames.includes(path)) {
        this.$router.push('404');
        this.$store.commit('setSidenav', false);
      } else if (this.$storage.existUser()) {
        this.$router.push(path);
        this.$store.commit('setSidenav', true);
      }
    },
    beforeWindowUnload (e) {
      e.preventDefault();
      e.returnValue = '';
    }
  },
  computed: {
    ...mapState(['auth', 'sidenav', 'main'])
  },
  watch: {
    $route(to, from) {
      if (this.$storage.get('menu')) {
        const ruta = this.$storage.get('menu').find(menu => menu.url === location.hash.substr(1));
        if (ruta) {
          this.$store.commit('setCurrentBackground', this.$vuetify.theme.dark ? ruta.propiedades.color_dark : ruta.propiedades.color_light);
        }
      }
      if (to.path === '/login') this.$vuetify.theme.dark = false;
      if (!this.$storage.existUser() && PageNoLogin.indexOf(to.path.substring(1)) === -1) {
        this.logout();
      }
      if (to.path !== '/login' && from.path !== '/login') {
        this.transitionName = 'fade';
      } else {
        this.transitionName = '';
      }
      if (to.path === '/login' && this.$storage.existUser()) {
        if (this.$storage.get('menu') && this.$storage.get('menu').length > 0) {
          this.$router.push(this.$storage.get('menu')[0].url);
        }
      }
      /* const { path } = to;
       * this.page404(path); */
    }
  }
};
</script>

<style lang="scss">
.main--content {
  .v-main__wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}
</style>
