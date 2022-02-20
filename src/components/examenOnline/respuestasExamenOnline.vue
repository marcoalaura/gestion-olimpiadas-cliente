<template>
  <v-card elevation="0" class="examen-online-revision w70">
    <v-card elevation="0">
      <section class="pt-6 pb-4 w100 d-flex flex-column align-center justify-center">
        <div>{{ area }}</div>
        <div>{{ areaGradoEscolar }}</div>
        <v-btn
          icon
          absolute
          right
          top
          @click="$store.commit('closeModal', 7)"
          color="primary"
        >
          <v-icon-component icon="close" :size="35"></v-icon-component>
        </v-btn>
      </section>
      <div
        :style="!['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'width: 70%; margin: auto' : ''"
        v-for="(question, idx) in aQuestions"
        :key="`content-${question.id}`"
        :step="idx + 1"
        :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'pa-0' : ''"
      >
        <v-card
          width="100%"
          class="d-flex align-start justify-center py-2"
          color="white"
          :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'flex-row'"
          elevation="0"
          height="auto"
          :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'overflow-y:auto' : 'overflow-y: auto'"
        >
          <v-card
            elevation="0"
            class="pl-5 pr-5 pb-2 user--select d-flex flex-column align-start justify-start"
            width="100%"
          >
            <div v-if="question.imagenPregunta">
              <b>{{ 'Pregunta ' + (idx + 1) + '.  '}}</b><br/>
              <b>{{ toCapitalize((question.tipoRespuesta || '').toLowerCase().replace('_', ' ')) }}</b><br/>
            </div>
            <v-card
              v-if="question.imagenPregunta"
              elevation="0"
              width="100%"
              :height="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'auto' : 'calc(100vh - 300px)'"
              class="d-flex flex-row align-center justify-center user--select"
            >
              <v-img
                :lazy-src="IMG_DEFAULT"
                :src="`${PATH_IMAGES}${ getName(question.imagenPregunta)}`"
                contain
                :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'max-height: calc(100vh - 300px)'"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-card>
            <v-card width="100%" v-else elevation="0">
              <b>{{ 'Pregunta ' + (idx + 1) + '.  '}}</b><br/>
              <b>{{ toCapitalize((question.tipoRespuesta || '').toLowerCase().replace('_', ' ')) }}</b><br/>
              {{ question.textoPregunta }}
            </v-card>
            <v-card elevation="0" class="d-flex flex-column align-start justify-center w100">
              <template v-if="[SELECCION_MULTIPLE].includes(question.tipoRespuesta)">
                <v-checkbox
                  v-for="(opcion, idx) in Object.keys(question.opciones)"
                  :key="opcion"
                  :input-value="answers[question.id] && answers[question.id].includes(opcion)"
                  :label="question.opciones[opcion] ? question.opciones[opcion] : abecedario[idx]"
                  hide-details
                  dense
                  disabled
                  :class="getQualificationClass(question.id, opcion)"
                ></v-checkbox>
              </template>
              <template v-if="[SELECCION_SIMPLE].includes(question.tipoRespuesta)">
                <v-radio-group :value="answers[question.id].pop()">
                  <v-radio
                    color="primary"
                    v-for="(opcion, idx) in Object.keys(question.opciones)"
                    :key="opcion"
                    :label="question.opciones[opcion] ? question.opciones[opcion] : abecedario[idx]"
                    :value="(opcion || '').toLowerCase().trim()"
                    hide-details
                    disabled
                    :class="getQualificationClass(question.id, opcion)"
                    dense
                  ></v-radio>
                </v-radio-group>
              </template>

              <template v-if="question.tipoRespuesta === FALSO_VERDADERO">
                <v-radio-group :value="answers[question.id].pop()">
                  <v-radio
                    color="primary"
                    v-for="opcion in ['VERDADERO', 'FALSO']"
                    :key="opcion"
                    :input-value="answers[question.id] && answers[question.id].includes(opcion.toUpperCase()) ? opcion: null"
                    :label="opcion.includes('VERDADERO') ? 'Verdadero' : 'Falso'"
                    class="seleccion--falso-verdadero"
                    :class="getQualificationClass(question.id, opcion.toUpperCase())"
                    :value="opcion.includes('VERDADERO') ? 'VERDADERO' : 'FALSO'"
                    hide-details
                    disabled
                    dense
                  ></v-radio>
                </v-radio-group>
              </template>
            </v-card>
          </v-card>
        </v-card>
      </div>
      <v-card elevation="0" class="w100 d-flex flex-row mt-8 align-center justify-center">
        <v-btn
          color="primary"
          depressed
          class="mb-7 font-weight-bold"
          style="text-transform: none"
          @click="$store.commit('closeModal', 7)"
        >
          Volver atras
        </v-btn>
      </v-card>
    </v-card>
  </v-card>
</template>
<script>
import img from './img';

const SELECCION_SIMPLE = 'SELECCION_SIMPLE';
const SELECCION_MULTIPLE = 'SELECCION_MULTIPLE';
const FALSO_VERDADERO = 'FALSO_VERDADERO';

const IMG_DEFAULT = `${process.env.VUE_APP_FRONTEND}/img/loader.gif`;
const PATH_IMAGES = process.env.VUE_APP_SERVER_MEDIA;

export default {
  props: {
    idExamen: {
      type: String,
      default: null
    },
    areaGradoEscolar: {
      type: String,
      default: null
    },
    area: {
      type: String,
      default: null
    },
    olimpiada: {
      type: String,
      default: null
    },
  },
  data: () => ({
    pdf: null,
    step: 1,
    aQuestions: [],
    answers: {},
    solutions: {},
    timer: false,
    counter: 1,
    showCounter: true,
    fechaHoraInicio: null,
    fechaHoraFin: null,
    duracionMinutos: null,
    abecedario: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
    SELECCION_SIMPLE: SELECCION_SIMPLE,
    SELECCION_MULTIPLE: SELECCION_MULTIPLE,
    FALSO_VERDADERO: FALSO_VERDADERO,
    IMG_DEFAULT: IMG_DEFAULT,
    PATH_IMAGES: PATH_IMAGES,
    IMG_LOGO: img,
  }),
  destroyed () {
    this.$store.commit('closeModal', 7);
  },
  methods: {
    getName (sName) {
      return (sName || '').trim().length > 0 ? sName.charAt(0) === '/' ? sName.substr(1, sName.length - 1) : sName : null;
    },
    toCapitalize(str) {
      return str?.split('').map((e, i) => (i === 0 ? e.toUpperCase() : e)).join('');
    },
    prev () {
      if (this.step > 1) this.step = this.step - 1;
    },
    next () {
      if (this.step < this.aQuestions.length) this.step = this.step + 1;
    },
    getQualificationClass(idPreguntaDetalle, opcion) {
      if (this.solutions[idPreguntaDetalle] && this.solutions[idPreguntaDetalle][opcion]) {
        return this.solutions[idPreguntaDetalle][opcion];
      }
      return '';
    }
  },
  mounted () {
    this.$nextTick(async () => {
      this.$vuetify.theme.dark = this.$storage.get('theme');
      const oPreguntas = await this.$service.get(`examenes/${this.idExamen || this.$storage.get('idExamen')}/calificacion`);
      if (oPreguntas && oPreguntas.isOK) {
        this.fechaHoraInicio = oPreguntas.datos.fechaHoraServidor ?? oPreguntas.datos.fechaHoraServidor ?? oPreguntas.datos.fechaHoraInicio;
        this.fechaHoraFin = oPreguntas.datos.fechaHoraFin;
        this.duracionMinutos = oPreguntas.datos.duracionMinutos;
        if (oPreguntas.datos.preguntas) {
          this.aQuestions = oPreguntas.datos.preguntas;
          this.aQuestions.filter(item => {
            if (item.tipoRespuesta === SELECCION_MULTIPLE) {
              this.answers[item.id] = item.respuestas ? Object.keys(item.respuestas) : [];
            }
            if (item.tipoRespuesta === SELECCION_SIMPLE || item.tipoRespuesta === FALSO_VERDADERO) {
              this.answers[item.id] = item.respuestas ? Object.keys(item.respuestas) : [];
            }
            this.solutions[item.id] = item.respuestas ? item.respuestas : {};
          });
        }
      } else {
        this.$message.error(oPreguntas.mensaje || 'Ocurrio un error');
        this.$router.push('/home');
      }
    });
  }
};
</script>
<style lang="scss">
@import '../../scss/variables.scss';
.examen-online-revision {
  .v-input--is-label-active {
    label {
      font-weight: 500 !important;
    }
  }
  .correcto {
    background: rgba(173, 253, 175, 0.3);
    label {
      color: $fontColor;
    }
  }
  .incorrecto {
    background: rgba(248, 155, 155, 0.3);
    label {
      color: $fontColor;
    }
  }
}
</style>
