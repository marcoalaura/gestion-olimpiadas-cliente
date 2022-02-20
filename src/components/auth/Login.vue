<template>
  <div class="login--app d-flex flex-column align-center justify-center">
    <div
      class="main d-flex align-center justify-center"
      :class="{
        'flex-row': $vuetify.breakpoint.name !== 'xs',
        'flex-column': $vuetify.breakpoint.name === 'xs'
      }"
    >
      <div
        class="description d-flex flex-column align-center justify-center"
      >
        <!-- <div class="image"></div> -->
        <div class="main-image mb-5">
          <v-img
            :max-width="$vuetify.breakpoint.name === 'xs' ? 350 : ['md', 'lg', 'xl'].includes($vuetify.breakpoint.name) ? 500 : 300"
            contain
            :src="this.$vuetify.theme.dark ? './img/header-logo-minedu-dark.png' : './img/header-logo-minedu.png'"
          />
        </div>
        <div class="text d-flex flex-column align-center justify-center">
          <v-container
            fluid
            :style="['md', 'lg', 'xl'].includes($vuetify.breakpoint.name) ? 'max-width: 75%; text-align: center' : 'text-align: center'"
          >
            <span class="primary--text fs11 font-weight-bold">SISTEMA DE EVALUACIÓN A DISTANCIA</span>
          </v-container>
          <v-container
            fluid
            :style="['md', 'lg', 'xl'].includes($vuetify.breakpoint.name) ? 'max-width: 80%; text-align: justify' : 'text-align: justify'"
            class="pt-3"
          >
            <section class="d-flex flex-column align-left justify-center">
              <section class="font-weight-light fs10 d-flex flex-row align-center justify-start mt-3">
                <v-icon-component icon="play_circle_outline" className="primary--text" :class="!['sm'].includes($vuetify.breakpoint.name) ? 'ml-6' : ''" :size="32"></v-icon-component>
                <div class="f-flex flex-column align-center justify-center ml-4">
                  <div class="primary--text fs8 font-weight-bold">¿Cómo dar la prueba?</div>
                  <div class="fs8 cursor--pointer text-link" @click="showTutorial">Leer el tutorial antes de ingresar</div>
                  <div class="fs8 cursor--pointer text-link" @click="goToVideo">Ver el video antes de ingresar</div>
                </div>
              </section>

              <section class="font-weight-light fs10 d-flex flex-row align-center justify-start mt-3">
                <v-icon-component icon="auto_stories" className="primary--text" :class="!['sm'].includes($vuetify.breakpoint.name) ? 'ml-6' : ''" :size="32"></v-icon-component>
                <div class="f-flex flex-column align-center justify-center ml-4">
                  <div class="primary--text fs8 font-weight-bold" style="text-align: left">Cronograma de la prueba</div>
                  <div class="fs8 cursor--pointer text-link" @click="goToCronograma">Revisa las fechas y horarios de las pruebas</div>
                </div>
              </section>

              <section class="font-weight-light fs10 d-flex flex-row align-center justify-start mt-3">
                <v-icon-component icon="mail" className="primary--text" :class="!['sm'].includes($vuetify.breakpoint.name) ? 'ml-6' : ''" :size="32"></v-icon-component>
                <div class="f-flex flex-column align-center justify-center ml-4">
                  <div class="primary--text fs8 font-weight-bold">¿Necesitas ayuda para ingresar?</div>
                  <div class="fs8">Envía tu consulta al correo: <br/><a style="text-decoration: none" href="mailto:olimpiadacientifica@minedu.gob.bo">olimpiadacientifica@minedu.gob.bo</a></div>
                </div>
              </section>

            </section>
          </v-container>
        </div>
      </div>
      <v-divider vertical v-if="!['xs'].includes($vuetify.breakpoint.name)"/>
      <div class="credentials d-flex flex-column align-center justify-center" >
        <template v-if="!['xs'].includes($vuetify.breakpoint.name)">
          <span class="iniciar-sesion primary--text font-weight-medium">Iniciar Sesión</span>
          <v-container style="text-align: left">
            <div class="font-weight-light" style="margin: auto; max-width: 300px; width: 300px">Ingresa con el usuario y contraseña otorgados por el Ministerio de Educación</div>
          </v-container>
        </template>
        <v-form
          lazy-validation
          ref="loginForm"
          class="d-flex flex-column align-center justify-center"
          :class="{
            'mt-5': $vuetify.breakpoint.name === 'xs'
          }"
        >
          <v-input-text-field
            @value="e => form.rude = e"
            v-model="form.rude"
            label="RUDE"
            :full-width="false"
            @keypress.enter.native="loginWithCredentials"
            :width="300"
            dense
            :clearable="false"
            :rules="[val => !!val || 'El campo RUDE no puede estar vacío']"
          >
          </v-input-text-field>
          <v-input-text-field
            @value="e => form.ci = e"
            v-model="form.ci"
            label="Cédula de Identidad"
            @keypress.enter.native="loginWithCredentials"
            :full-width="false"
            :width="300"
            dense
            v-on:append="() => showPassword = !showPassword"
            :append-icon="showPassword ? ICONS.visibility : ICONS.visibility_off"
            :type="!showPassword ? 'password' : 'text'"
            :rules="[val => !!val || 'El campo C.I. no puede estar vacío']"
          >
          </v-input-text-field>
          <v-btn
            color="primary"
            class="rounded-lg mb-5"
            depressed
            height="50"
            block
            :loading="loadingCredentials"
            :disabled="loadingCredentials"
            @click="loginWithCredentials"
          >
            <span class="font-weight-bold" style="text-transform: capitalize; font-size: .9rem">
              Ingresar
            </span>
          </v-btn>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Auth from './mixins/auth';

export default {
  mixins: [Auth],
  data() {
    return {
      form: {
        user: null,
        password: null
      },
      loadingCredentials: null,
      showPassword: false,
      userTooltip: null,
      passwordTooltip: null,
      modalIngresarCredentials: false,
      show: false
    };
  },
  mounted() {
    this.$nextTick(async () => {
      this.$vuetify.theme.dark = this.$storage.get('theme');
      if (this.$route.query?.code) {
        try {
          const request = {
            method: 'GET',
            url: `${this.$baseServer}usuarios/perfil`,
            headers: {
              Authorization: `Bearer ${this.$route.query.code}`
            }
          };
          let credentials = await axios(request);
          credentials = {
            data: {
              datos: {
                ...credentials.data.datos,
                access_token: this.$route.query.code
              }
            }
          };
          await this.credentials(null, null, credentials.data);
        } catch (err) {
          this.$message.error(err.message);
        }
      } else {
        if (this.$route.path !== '/login') this.$router.push('/login');
      }
    });
  },
  methods: {
    showTutorial () {
      const path = `${process.env.VUE_APP_FRONTEND}/tutorial.pdf`;
      window.open(path, '_blank');
    },
    goToVideo () {
      const videoUrl = 'https://www.youtube.com/watch?v=8sDoZ8o3-gw&feature=youtu.be';
      window.open(videoUrl, '_blank');
    },
    goToCronograma () {
      const videoUrl = `${process.env.VUE_APP_FRONTEND}/cronograma.pdf`;
      window.open(videoUrl, '_blank');
    },
    setCookie(name, value, days = 7, path = '/') {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path;
    },
    getCookie(name) {
      return document.cookie.split('; ')
        .reduce((r, v) => {
          const parts = v.split('=');
          return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, '');
    },
    loginWithCredentials() {
      if (this.$refs.loginForm.validate()) {
        this.credentials(this.form.rude, this.form.ci, null);
      } else {
        this.$message.error('Complete los campos obligatorios');
      }
    },
    /**
     * @function loginOpenid
     * @description Conectar con OpenID
     */
    loginOpenid() {
      this.getCode();
    },
    cancel() {
      this.resetForm();
      this.modalIngresarCredentials = false;
    },
    mostrarModalCredentials() {
      this.modalIngresarCredentials = true;
    },
    resetForm() {
      this.form = {
        user: null,
        password: null,
      };
    }
  }
};
</script>

<style lang="scss">
@import '../../scss/variables.scss';
.login--app {
  .main {
    padding-top: 0;
      .credentials {
        .iniciar-sesion {
          font-weight: 500;
          font-size: 1.4rem;
          margin-bottom: 10px;
          max-width: 80% !important;
        }
      }
      .description {
        .image {
          background: url('../../../public/img/logoOlimpiadas.png') no-repeat;
          background-position: top center;
          background-size: contain;
          object-fit: contain;
          width: 250px;
          height: 150px;
        }
        .text {
          margin: auto;
          span {
            user-select: none;
            &:first-child {
              font-weight: 500;
              font-size: 1.1rem;
              margin-top: 10px;
              margin-bottom: 10px;
            }
            &:last-child {
              font-size: 0.83rem;
            }
          }
        }
      }
      .text-link {
        text-align: left;
      }
      .text-link:hover {
        color: var(--v-primary-base);
      }
  }
}
@media screen and (min-width: 601px) {
  .login--app {
    .header {
      background-position: top center;
      background-size: contain;
      width: 100%;
      height: 200px;
    }
    .main {
      .credentials {
        width: 50%;
      }
      .description {
        width: 50%;
        .text {
          width: 70%;
          span {
            user-select: none;
            &:first-child {
              text-align: center;
            }
            &:last-child {
              text-align: left;
            }
          }
        }
      }
      .text-link {
        text-align: left;
      }
      .text-link:hover {
        color: var(--v-primary-base);
      }
    }
  }
}

@media screen and (max-width: 600px) and (min-width: 1px) {
  .login--app {
    .header {
      background-position: top center;
      background-size: contain;
      width: 100%;
      height: 200px;
    }
    .main {
      .credentials {
        width: 100%;
      }
      .description {
        width: 100%;
        .text {
          width: 85%;
          span {
            user-select: none;
            &:first-child {
              text-align: center;
            }
            &:last-child {
              text-align: justify;
            }
          }
        }
      }
      .text-link {
        text-align: left;
      }
      .text-link:hover {
        color: var(--v-primary-base);
      }
    }
  }
}
</style>
