import axios from 'axios';
import moment from 'dayjs';

export default {
  methods: {
    getModules(roles, rol = null) {
      if (Array.isArray(roles) && roles.length > 0) {
        if (rol) {
          const menu = roles.find(item => {
            if (item.rol === rol) return item.modulos;
          });
          return menu.modulos;
        } else {
          return roles[0].modulos;
        }
      } else {
        return [];
      }
    },
    getRoles(roles) {
      if (Array.isArray(roles)) {
        return roles.map(item => item.rol);
      } else {
        return [];
      }
    },
    getRol(roles) {
      if (Array.isArray(roles) && roles.length > 0) {
        return roles[0].rol;
      }
    },
    exit() {
      this.$confirm(
        '¿Está seguro de salir del sistema?',
        () => {
          this.logout();
        },
        null
      );
    },
    async credentials(rude, contrasena, data = {}) {
      try {
        let credentials = data;
        if (rude && contrasena) {
          this.loadingCredentials = true;
          credentials = await this.$service.post('auth/estudiante', {
            rude: btoa(encodeURI(rude)),
            usuario: btoa(encodeURI(contrasena))
          });
          if (!credentials || credentials.codigo) {
            this.loadingCredentials = false;
            throw new Error(
              credentials?.mensaje
                || 'Existen problemas de conexión. Por favor revise su configuración a Internet.'
            );
          }
        }
        const { datos } = credentials;
        this.$storage.set('user', datos.data.persona || {});
        this.$storage.set('id', datos.data.id);
        this.$storage.set('token', datos.data.access_token);
        this.$storage.set('roles', [...this.getRoles(datos.data.roles)]);
        this.$storage.set('rol', this.getRol(datos.data.roles));
        this.$storage.set('modules', datos.data.roles);
        this.$storage.set('menu', [...this.getModules(datos.data.roles)]);
        this.$vuetify.theme.dark = this.$storage.get('theme') || this.$vuetify.theme.dark;
        this.$storage.set('theme', this.$vuetify.theme.dark);
        this.$storage.set('sidenav', true);
        this.$store.commit('setProfile', datos.data.persona);
        this.$store.commit('setIdEstudiante', datos.data.id);

        // definimos tiempo de vida de token
        const payload = this.getPayload();
        // const actualDate = Math.round(new Date().getTime() / 1000);
        const actualDate = moment().subtract(5, 'seconds');
        this.$storage.set('ttl', payload.exp - payload.iat);
        this.$storage.set('t', actualDate);

        this.$store.commit('setAuth', true);
        this.$store.commit('setSidenav', true);
        this.$store.commit('setMain', true);
        this.loadingCredentials = false;
        this.$router.push('/home');
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    getPayload () {
      if (this.$storage.get('token')) {
        const jwtStr = this.$storage.get('token').split('.')[1];
        return JSON.parse(atob(jwtStr));
      }
      return null;
    },
    reload() {
      this.$store.commit('setMain', false);
      this.$nextTick(() => {
        this.$store.commit('setMain', true);
      });
    },
    cleanData(store) {
      store.commit('setDefault');
    },
    async logout(router, store) {
      let response = {};
      if (this.$storage.get('token')) {
        const request = {
          url: `${this.$baseServer}logout`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.$storage.get('token')}`
          }
        };
        response = await axios(request);
        response = response.data;
      }
      const storevuex = store || this.$store;
      router = router || this.$router;
      this.$storage.removeUser();
      // this.$storage.remove('theme');
      const theme = this.$storage.get('theme');
      this.$storage.removeAll();
      this.$storage.set('theme', theme);
      this.$store?.commit('resetProfile');
      this.cleanData(storevuex);
      const { path } = router && router.history ? router.history.current : null;
      if (response.url) {
        window.location.href = response.url;
        return;
      }
      if (['/reportes', '/clasificacion', '/medalleros'].includes(path)) {
        // No se hara nada cuando este en esta ruta
      } else if (path !== '/login') {
        router.push('/login');
      }
    }
  }
};
