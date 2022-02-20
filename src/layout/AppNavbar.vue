<template>
  <div>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      flat
      :app="['/login', '/home', '/examen'].includes($route.path)"
      color="backgroundColor"
      height="60"
      class="pa-0 ma-0 navbar"
    >
      <v-btn
        v-if="['/reportes', '/clasificados', '/medalleros'].includes($route.path)"
        icon
        color="primary"
        @click="setDrawer"
      >
        <v-icon-component icon="menu"/>
      </v-btn>
      <span class="primary--text fs10 font-weight-bold" v-if="!['/login'].includes($route.path) && !['xs'].includes($vuetify.breakpoint.name)">SISTEMA DE EVALUACIÓN A DISTANCIA</span>

      <v-spacer></v-spacer>
      <v-card elevation="0">
        <v-btn id="btnTheme" :small="['xs', 'sm'].includes($vuetify.breakpoint.name)" icon text
          @click="setTheme">
          <v-icon-component :icon="$vuetify.theme.dark ? 'dark_mode' : 'light_mode'" class="primary--text" color="primary"/>
        </v-btn>
        <v-btn v-if="auth && !['/login', '/reportes', '/clasificados', '/medalleros'].includes($route.path)" id="btnSettings" :small="['xs', 'sm'].includes($vuetify.breakpoint.name)" text depressed icon
          class="primary--text" @click="settings">
          <v-icon-component icon="settings" color="primary"/>
        </v-btn>
      </v-card>

          <!-- SECCION DE SETTINGS -->
          <v-dialog
            v-model="modalSettings"
            content-class="settings"
            :width="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 300 : 200"
            :overlay-opacity="['xs', 'sm'].includes($vuetify.breakpoint.name) ? .7 : 0"
          >
            <v-card elevation="0">
              <template v-for="item in aSettings">
                <v-list-item
                  :key="item.url"
                  color="primary"
                  dense
                  link
                  @click="redirect(item)"
                >
                  <v-list-item-icon :class="`bloque--configuraciones ml-1 mr-1`">
                    <v-icon-component :icon="item.icono" class="primary--text"></v-icon-component>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="ruta--menu fontColor--text fs9">
                      {{ item.label }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-card>
          </v-dialog>
    </v-app-bar>
  </div>
</template>

<script>
import systemAppearance from 'system-appearance';
import { mapState } from 'vuex';
import Auth from '@/components/auth/mixins/auth';

export default {
  mixins: [Auth],
  data: () => ({
    clipped: false,
    title: null,
    apps: false,
    modalSettings: false,
    rutas: [],
    roles: [],
    user: null,
    mRol: null,
    selectedRoute: null,
    menuIcon: 'home',
    themeVerify: false,
    aSettings: [],
    radioGroup: null,
    rol: ''
  }),
  methods: {
    setDrawer () {
      this.$storage.set('drawer', !this.drawer);
      this.$root.$refs.AppSideBar.updateStateSidebar();
    },
    getLastColor () {
      const menu = this.$storage.get('selectedMenu');
      if (menu) {
        return menu.propiedades[this.$vuetify.theme.dark ? 'color_dark' : 'color_light'];
      }
      return 'null';
    },
    actualizarIcono(url) {
      let { path } = this.$route;
      path = url ?? path;
      if (this.$storage.get('menu') && !this.rutas) {
        this.rutas = this.$storage.get('menu');
      }
      if (this.rutas && this.rutas.length > 0) {
        let rutas = this.rutas.filter(item => item.url === path);
        if (rutas.length === 0) {
          this.rutas.filter(item => item.subModulo != null && item.subModulo.length > 0).forEach(ruta => {
            rutas = rutas.concat(ruta.subModulo.filter(item => item.url === path));
          });
        }
        if (rutas && rutas.length > 0) {
          this.menuIcon = rutas[0].propiedades && rutas[0].propiedades.icono ? rutas[0].propiedades.icono : null;
          this.$store.state.currentBackground = rutas[0].propiedades && rutas[0].propiedades.color_light && rutas[0].propiedades.color_light ? this.$vuetify.theme.dark ? rutas[0].propiedades.color_dark : rutas[0].propiedades.color_light : null;
        } else {
          this.menuIcon = 'home';
          this.$store.state.currentBackground = undefined;
        }
      }
    },
    darkModeListener() {
      if (this.themeVerify || this.$storage.get('theme') == null) {
        this.$vuetify.theme.dark = true;
        this.$storage.set('theme', this.$vuetify.theme.dark);
      }
    },
    lightModeListener() {
      if (this.themeVerify || this.$storage.get('theme') == null) {
        this.$vuetify.theme.dark = false;
        this.$storage.set('theme', this.$vuetify.theme.dark);
      }
    },
    settings() {
      this.user = this.$storage.getUser();
      const { nombreCompleto } = this;
      this.roles = this.$storage.get('roles');
      const { idRol } = this.$storage.get('rol');
      this.radioGroup = idRol;
      const [firstElement] = this.roles;
      this.mRol = firstElement;
      this.aSettings = [
        {
          icono: 'person',
          url: '/perfil',
          label: nombreCompleto
        },
        {
          icono: 'logout',
          label: 'Cerrar sesión'
        }
      ];
      this.modalSettings = !this.modalSettings;
    },
    isActive(url) {
      return this.$route.path === url;
    },
    toCapitalize(str) {
      return str?.split('').map((e, i) => (i === 0 ? e.toUpperCase() : e)).join('');
    },
    setTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.$storage.set('theme', this.$vuetify.theme.dark);
      this.$store.commit('setCurrentBackground', this.$vuetify.theme.dark);
      this.actualizarIcono();
    },
    async setRol({ rol, idRol, idOlimpiada }) {
      try {
        this.modalSettings = false;
        if (rol && idRol && idOlimpiada) {
          const response = await this.$service.post('change-rol', {
            idRol,
            idOlimpiada
          });
          const { datos } = response;
          await this.setData(datos);
          const menus = this.getModules(this.$storage.get('modules'), rol);
          this.$storage.set('menu', menus);
          this.rol = rol;
          this.$store.commit('setMenu', menus);
          if (this.$route.path !== '/home') this.$router.push('/home');
          if (this.$route.path === '/home') this.reload();
        }
      } catch (error) {
        this.$message.error(error?.message || 'Ocurrio un problema');
      }
    },
    reload() {
      this.$store.commit('setMain', false);
      this.$nextTick(() => {
        this.$store.commit('setMain', true);
      });
    },
    showApps() {
      this.rutas = this.$storage.get('menu');
      this.apps = !this.apps;
    },
    redirect(subItem) {
      this.modalSettings = false;
      if (subItem && subItem.hasOwnProperty('url')) {
        if (this.$route.path.replace(/\//gi, '') !== subItem.url) {
          this.$router.push(subItem.url);
          setTimeout(() => {
            this.getParent();
          }, 100);
        }
      } else {
        if (subItem.icono === 'logout') {
          this.$confirm('¿Está seguro de cerrar la sesión?', () => {
            this.modalSettings = false;
            this.logout();
          });
        }
      }
    },
    hasNoSupport() {
      this.appearance = null;
    }
  },
  computed: {
    nombreCompleto () {
      return (this.user && this.user.nombres ? this.user.nombres : '').toUpperCase();
    },
    ...mapState([
      'auth',
      'currentBackground',
      'stages',
      'areas',
      'selectedArea',
      'drawer'
    ])
  },
  mounted() {
    systemAppearance(this.darkModeListener, this.lightModeListener, this.hasNoSupport);
    this.$nextTick(async () => {
      this.rol = this.$storage.get('rol')?.rol;
      this.rutas = this.$storage.get('menu');
      this.$vuetify.theme.dark = this.$storage.get('theme');
      this.themeVerify = true;
    });
  },
  created() {
    this.$root.$refs.AppNavbar = this;
    this.$router.onReady(() => {
      this.actualizarIcono();
    });
  }
};
</script>

<style lang="scss">
@import '../scss/variables.scss';

.navbar {
  .v-toolbar__content {
    border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
  }
}

.item--group {
  .v-list-group__header__prepend-icon {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: var(--color_fondo) !important;
    border-radius: 10px;
    min-width: 60px !important;
    width: 60px !important;
    min-height: 60px !important;
    height: 60px !important;
  }
}

.setting {
  .v-list-group__header__append-icon {
    display: none !important;
  }
}

@media screen and (min-width: 768px) {
  .settings {
    position: fixed;
    z-index: 10;
    min-width: 300px;
    right: 0;
    top: 65px;
    padding: 20px 0px 20px 0px;
    border-radius: 7px !important;
    background: $white;
    transition: top 0.3s ease-in;
    .v-list-group__header__append-icon {
      display: none !important;
    }
  }
  .text--ellipsis {
    text-overflow: ellipsis;
    max-width: 220px;
    white-space: nowrap;
    overflow: hidden;
  }
}

</style>
