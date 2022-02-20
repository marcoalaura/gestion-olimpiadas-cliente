<template>
  <v-card elevation="0" class="examen-online">
    <transition name="counter" mode="out-in">
      <v-card elevation="0">
        <v-card elevation="0" class="header ml-4 d-flex flex-row align-center justify-space-between">
          <v-card elevation="0" class="d-flex flex-row align-center justify-start">
            <v-img
              :max-width="50"
              :max-height="50"
              contain
              :src="$storage.get('logo')"
            />
            <v-card elevation="0" class="ml-2">
              <section class="fs10 titulo-header">{{ toCapitalize((area || this.$storage.get('area')).toLowerCase()) }}</section>
              <section class="fs8 color7--text">{{ toCapitalize((areaGradoEscolar || this.$storage.get('areaGradoEscolar')).toLowerCase())}}</section>
            </v-card>
          </v-card>
          <clock
            v-if="fechaHoraInicio"
            :fechaHoraInicio="fechaHoraInicio"
            :fechaHoraFin="fechaHoraFin"
            :fechaHoraServidor="fechaHoraServidor"
            @end="end"
            :duracionMinutos="duracionMinutos"
          />
        </v-card>

        <v-card elevation="0" class="mt-4 mb-4 d-flex flex-row align-center justify-space-between">
          <span class="color7--text ml-4" v-if="!['xs', 'sm'].includes($vuetify.breakpoint.name)">Navegación de preguntas</span>
        </v-card>

        <v-skeleton-loader
          style="margin: auto"
          width="95%"
          v-if="!loading"
          type="list-item-avatar, divider, list-item-three-line, card-heading, image, actions"
        />
        <v-stepper
          v-else
          v-model="step"
          alt-labels
          class="mt-2"
          :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'margin-top: -20px !important' : ''"
        >
          <template v-if="['xs', 'sm'].includes($vuetify.breakpoint.name)">
            <section style="left: 9px; position: relative;" class="cursor--pointer" @click="showNumbers">
              <section class="mt-2 mb-2 number--step">
                {{ step }}
              </section>
            </section>
          </template>
          <v-stepper-header
            :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'display: none !important' : ''"
            class="d-flex flex-row align-start justify-start flex-wrap w100"
          >
            <template v-for="(question, idx) in aQuestions">
              <v-stepper-step
                :key="question.id"
                :step="idx + 1"
                editable
                :class="[getClass(question), 's__steps']"
                color="color5"
              >
              </v-stepper-step>
              <v-divider :key="`divider_${question.id}`"/>
            </template>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content
              v-for="(question, idx) in aQuestions"
              :key="`content-${question.id}`"
              :step="idx + 1"
              :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'pa-0' : 'pa-0'"
            >
              <v-card
                width="100%"
                class="d-flex align-start justify-center"
                color="white"
                :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'flex-row'"
                elevation="0"

                :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'overflow-y:auto' : 'overflow-y: auto'"
              >
                <v-card
                  elevation="0"

                  style="overflow-y: auto"
                  class="pa-5 user--select d-flex flex-column align-start justify-start"
                  width="100%"
                >
                  <v-card elevation="0" class="color7--text font-weight-bold mb-5" v-if="question.tipoRespuesta === SELECCION_SIMPLE">Pregunta de selección simple</v-card>
                  <v-card elevation="0" class="color7--text font-weight-bold mb-5" v-if="question.tipoRespuesta === SELECCION_MULTIPLE">Pregunta de selección multiple</v-card>
                  <v-card elevation="0" class="color7--text font-weight-bold mb-5" v-if="question.tipoRespuesta === FALSO_VERDADERO">Pregunta de selección falso/verdadero</v-card>
                  <v-card
                    v-if="question.imagenPregunta"
                    elevation="0"
                    width="100%"
                    height="auto"
                    class="d-flex flex-row align-center justify-center user--select"
                  >

                    <img v-if="!['xs', 'sm'].includes($vuetify.breakpoint.name) " :src="`${PATH_IMAGES}${ getName(question.imagenPregunta)}`" alt="imagen-pregunta"/>
                    <v-img
                      v-else
                      :lazy-src="IMG_DEFAULT"
                      :src="`${PATH_IMAGES}${ getName(question.imagenPregunta)}`"
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
                  <v-card width="100%" v-else elevation="0" class="color7--text">
                    {{ question.textoPregunta }}
                  </v-card>
                  <v-card elevation="0" :class="['max-width w100', question.imagenPregunta ? 'd-flex flex-row align-center justify-space-around' : '']">
                    <template v-if="[SELECCION_MULTIPLE].includes(question.tipoRespuesta)">
                      <v-checkbox
                        color="primary"
                        v-for="(opcion, idx) in Object.keys(question.opciones)"
                        :key="opcion"
                        :class="(answers[question.id] || []).includes(opcion) ? 'seleccion--multiple' : ''"
                        v-model="answers[question.id]"
                        :label="question.opciones[opcion] ? question.opciones[opcion] : abecedario[idx]"
                        :value="opcion"
                        @click="sendAnswer(question)"
                        :multiple="question.tipoRespuesta === SELECCION_MULTIPLE"
                        hide-details
                        dense
                      ></v-checkbox>
                    </template>
                    <template v-if="[SELECCION_SIMPLE].includes(question.tipoRespuesta)">
                      <v-radio-group
                        v-model="answers[question.id]"
                        :row="!!question.imagenPregunta"
                      >
                        <v-radio
                          color="primary"
                          v-for="(opcion, idx) in Object.keys(question.opciones)"
                          :key="opcion"
                          :class="answers[question.id] === opcion ? 'seleccion--simple' : ''"
                          :label="question.opciones[opcion] ? question.opciones[opcion] : abecedario[idx]"
                          :value="opcion"
                          @click="sendAnswer(question)"
                          hide-details
                          dense
                        ></v-radio>
                      </v-radio-group>
                    </template>

                    <template v-if="question.tipoRespuesta === FALSO_VERDADERO">
                      <v-radio-group row v-model="answers[question.id]" class="d-flex flex-row align-center justify-center grupo--falso_verdadero">
                        <v-radio
                          color="primary"
                          v-for="opcion in ['VERDADERO', 'FALSO']"
                          :key="opcion"
                          class="seleccion--falso-verdadero"
                          :label="opcion.includes('VERDADERO') ? 'Verdadero' : 'Falso'"
                          :value="opcion.includes('VERDADERO') ? 'VERDADERO' : 'FALSO'"
                          @click="sendAnswer(question)"
                          hide-details
                          dense
                        ></v-radio>
                      </v-radio-group>
                    </template>
                  </v-card>
                  <v-card elevation="0" width="100%" class="buttons d-flex flex-row align-center justify-center mt-5">
                    <v-btn
                      color="primary"
                      :disabled="step === 1"
                      outlined
                      depressed
                      class="ma-1 white--text mr-5"
                      style="text-transform: none"
                      @click="prev"
                    >
                      <v-icon-component icon="arrow_back"/>
                      Anterior
                    </v-btn>
                    <v-btn
                      color="primary"
                      :disabled="step === aQuestions.length"
                      outlined
                      depressed
                      class="ma-1 white--text ml-5"
                      style="text-transform: none"
                      @click="next"
                    >
                      Siguiente
                      <v-icon-component icon="arrow_forward"/>
                    </v-btn>
                  </v-card>
                  <v-card width="100%" elevation="0" class="d-flex flex-row align-center justify-center mt-4">
                    <v-btn
                      color="primary"
                      depressed
                      :block="['xs'].includes($vuetify.breakpoint.name)"
                      class="ma-1 white--text font-weight-bold"
                      style="text-transform: none"
                      @click="finish"
                    >Finalizar</v-btn>
                  </v-card>
                </v-card>
              </v-card>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card>
    </transition>
  <!-- PDF -->
  <div v-if="showPDF">
    <div style="display: none">
      <div id="container">
        <div class="container-pdf" style="width: 200px; height: 255px;">
          <table style="width: 200px; font-family: Arial">
            <tr style="height: 68px">
              <td colspan="4" style="width: 199px">
                <img :src="IMG_LOGO" width="199px" style="padding-top: 2px; margin-left: -1px" height="59px" alt="Ministerio de educacion"/>
                <div style="margin-left: -9px; margin-top: -3px; font-family: Arial; font-size: 5px; text-align: center;">{{ olimpiada.olimpiada }}</div>
              </td>
            </tr>
            <tr style="height: 9px">
              <td style="font-family: Arial; font-size: 4.4px; width: 40px">RUDE:</td>
              <td style="font-family: Arial; font-size: 4.4px; width: 50px">{{ olimpiada.rude }}</td>
              <td style="font-family: Arial; font-size: 4.4px; width: 60px">Fecha y hora de Inicio:</td>
              <td style="font-family: Arial; font-size: 4.4px; width: 50px">
                {{ $datetime.format('DD/MM/YYYY', new Date(olimpiada.fechaInicio))}}
                {{ $datetime.getHour(new Date(olimpiada.fechaInicio))}}:{{ $datetime.getMinutes(new Date(olimpiada.fechaInicio))}}:{{ $datetime.getSeconds(new Date(olimpiada.fechaInicio))}}
              </td>
            </tr>
            <tr style="height: 9px">
              <td style="font-family: Arial; font-size: 4.4px; width: 40px">Area:</td>
              <td style="font-family: Arial; font-size: 4.4px; width: 50px">{{ olimpiada.area }}</td>
              <td style="font-family: Arial; font-size: 4.4px; width: 64px">Fecha y hora de Finalización:</td>
              <td style="font-family: Arial; font-size: 4.4px; width: 45px">
                {{ $datetime.format('DD/MM/YYYY', new Date(olimpiada.fechaFinalizacion))}}
                {{ $datetime.getHour(new Date(olimpiada.fechaFinalizacion)) }}:{{ $datetime.getMinutes(new Date(olimpiada.fechaFinalizacion)) }}:{{ $datetime.getSeconds(new Date(olimpiada.fechaFinalizacion)) }}
              </td>
            </tr>
            <tr style="height: 9px">
              <td style="font-family: Arial; font-size: 4.4px; width: 42px">Año de escolaridad:</td>
              <td style="font-family: Arial; font-size: 4.4px; width: 40px">{{ olimpiada.gradoEscolar }}</td>
              <td style="font-family: Arial; font-size: 4.4px; width: 50px">Departamento:</td>
              <td style="font-family: Arial; font-size: 4.4px; width: 50px">{{ olimpiada.departamento }}</td>
            </tr>
            <tr style="height: 9px">
              <td style="font-family: Arial; font-size: 4.4px; width: 40px">Etapa:</td>
              <td style="font-family: Arial; font-size: 4.4px; width: 50px">{{ olimpiada.etapa }}</td>
              <td style="font-family: Arial; font-size: 4.4px; width: 60px">Distrito Educativo:</td>
              <td style="font-family: Arial; font-size: 4.4px; width: 50px">{{ olimpiada.distritoEducativo }}</td>
            </tr>
            <tr style="height: 9px">
              <td colspan="4" style="font-family: Arial; font-size: 4.5px; width: 50px"><br/>
                {{ olimpiada.estudiante }}: Gracias por participar en la {{ olimpiada.olimpiada }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
  <v-dialog
    scrollable
    :transition="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'slide-x-transition' : 'scale-transition'"
    v-model="$store.state.modal3"
    persistent
    fullscreen
    :key="Math.random() * 1000"
  >
    <resumen
      step="RESUMEN"
      :questions="aQuestions"
      :answers="answers"
      :key="Math.random() * 1000"
      @go="goToStep"
      @finish="end"
      :questionsNotResponding="questionsNotResponding"
    />
  </v-dialog>
  <v-dialog
    scrollable
    :transition="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'slide-x-transition' : 'scale-transition'"
    v-model="$store.state.modal4"
    persistent
    fullscreen
    :key="Math.random() * 1000"
  >
    <resumen
      step="PRUEBA_FINALIZADA"
      :data="datosFinales"
      @home="backToHome"
      @generate="generate"
    />
  </v-dialog>
  <v-dialog
    scrollable
    :transition="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'slide-x-transition' : 'scale-transition'"
    v-model="$store.state.modal6"
    persistent
    fullscreen
    :key="Math.random() * 1000"
  >
    <resumen
      step="STEPS_MOBILE"
      :questions="aQuestions"
      :answers="answers"
      @go="goToStep"
      @finish="end"
      :currentStep="currentStep"
      :questionsNotResponding="questionsNotResponding"
    />
  </v-dialog>
  </v-card>
</template>
<script>
import jspdf from './mixins/pdf';
import img from './img';
import resumen from '../home/modalExamen.vue';
import clock from './clock.vue';

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
    logo: {
      type: String,
      default: null
    },
    area: {
      type: String,
      default: null
    },
  },
  mixins: [jspdf],
  data: () => ({
    pdf: null,
    step: 0,
    aQuestions: [],
    answers: {},
    timer: false,
    counter: 1,
    interval: null,
    loading: false,
    showCounter: true,
    currentStep: 0,
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
    olimpiada: {},
    showPDF: null,
    fechaHoraServidor: null,
    datosFinales: null,
    questionsNotResponding: 0,
    copySeleccion: {}
  }),
  components: {
    resumen,
    clock
  },
  methods: {
    getName (sName) {
      return (sName || '').trim().length > 0 ? sName.charAt(0) === '/' ? sName.substr(1, sName.length - 1) : sName : null;
    },
    goToStep (step) {
      this.$store.commit('closeModal', 3);
      this.$store.commit('closeModal', 6);
      this.step = step;
    },
    showNumbers () {
      this.$store.commit('openModal', 6);
      this.currentStep = this.step;
    },
    backToHome () {
      this.$store.commit('closeModal', 2);
      this.$store.commit('closeModal', 3);
      this.$store.commit('closeModal', 4);
      this.$store.commit('closeModal', 6);
      this.$storage.destroy('idExamen');
      this.$router.push('/home');
    },
    prev () {
      if (this.step > 1) this.step = this.step - 1;
    },
    next () {
      if (this.step < this.aQuestions.length) this.step = this.step + 1;
    },
    toCapitalize(str) {
      return str?.split('').map((e, i) => (i === 0 ? e.toUpperCase() : e)).join('');
    },
    async pdfGenerate () {
      try {
        this.$waiting(true, 'Espere unos segundos por favor...');
        const response = await this.$service.patch(`examenes/${this.idExamen || this.$storage.get('idExamen')}/finalizar`);
        if (response && response.isOK) {
          await this.generate(response.datos);
          this.$storage.destroy('idExamen');
          this.$router.push('/home');
        } else {
          this.$waiting(false);
          this.showPDF = null;
          throw new Error(response.mensaje);
        }
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    generate () {
      return new Promise((resolve, reject) => {
        try {
          this.$waiting(true, 'Espere unos segundos por favor mientras se genera su comprobante...');
          this.olimpiada = this.datosFinales;
          this.initPDF();
          setTimeout(() => {
            const html = document.querySelector('#container');
            this.generatePDF(html);
            resolve(true);
          }, 200);
        } catch (error) {
          this.$waiting(false);
          this.showPDF = null;
          reject(error.message);
        }
      });
    },
    async end (timeout = null) {
      try {
        if (timeout) {
          const response = await this.$service.patch(`examenes/${this.idExamen || this.$storage.get('idExamen')}/finalizar`);
          if (response && response.isOK) {
            this.datosFinales = response.datos;
            this.$storage.set('rude', this.datosFinales.rude);
            this.$storage.set('area', this.datosFinales.area);
            this.$store.commit('openModal', 4);
          } else {
            this.$message.error(response.mensaje);
          }
        } else {
          this.$confirm('¿Estás realmente seguro que deseas finalizar la prueba?', async () => {
            const response = await this.$service.patch(`examenes/${this.idExamen || this.$storage.get('idExamen')}/finalizar`);
            if (response && response.isOK) {
              this.datosFinales = response.datos;
              this.$storage.set('rude', this.datosFinales.rude);
              this.$storage.set('area', this.datosFinales.area);
              this.$store.commit('openModal', 4);
            } else {
              this.$message.error(response.mensaje);
            }
          }, () => {
            this.$store.commit('closeModal', 3);
          }, 'SI, ESTOY SEGURO', 'NO, REGRESAR');
        }
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    finish () {
      const questionsNotResponding = Object.keys(this.answers).reduce((questions, key) => {
        if (this.answers[key] && Array.isArray(this.answers[key]) && this.answers[key].length === 0) {
          questions = questions + 1;
        } else if (!this.answers[key]) {
          questions = questions + 1;
        }
        return questions;
      }, 0);
      this.questionsNotResponding = questionsNotResponding;
      this.$store.commit('openModal', 3);
    },
    async sendAnswer ({ id, tipoRespuesta }) {
      try {
        if (this.answers[id] === this.copySeleccion[id]) this.answers[id] = null;
        this.copySeleccion[id] = this.answers[id];
        const response = await this.$service.patch(`examenes/detalle/${id}`, {
          respuestas: Array.isArray(this.answers[id]) ? this.answers[id] : this.answers[id] ? [this.answers[id]] : []
        });
        this.getClass({ id, tipoRespuesta });
        if (!response.isOK) throw new Error(response.mensaje);
      } catch (error) {
        this.$router.push('/home');
        this.$message.error(error.mensaje || error.message || 'Ocurrio un error');
      }
    },
    getClass ({ id, tipoRespuesta }) {
      const cssMobile = ['xs', 'sm'].includes(this.$vuetify.breakpoint.name) ? 'is--mobile' : 'is--desktop';
      if (tipoRespuesta === SELECCION_MULTIPLE) {
        return this.answers[id] && this.answers[id].length > 0 ? `step-success ${cssMobile}` : `step-error ${cssMobile}`;
      } else if (tipoRespuesta === SELECCION_SIMPLE) {
        return this.answers[id] ? `step-success ${cssMobile}` : `step-error ${cssMobile}`;
      } else {
        return this.answers[id] ? `step-success ${cssMobile}` : `step-error ${cssMobile}`;
      }
    }
  },
  mounted () {
    this.$nextTick(async () => {
      this.$vuetify.theme.dark = this.$storage.get('theme');
      const oPreguntas = await this.$service.get(`examenes/${this.idExamen || this.$storage.get('idExamen')}`);
      if (oPreguntas && oPreguntas.isOK) {
        const fechaHoraInicio = oPreguntas.datos.fechaHoraServidor ?? oPreguntas.datos.fechaHoraServidor ?? oPreguntas.datos.fechaHoraInicio;
        this.fechaHoraInicio = Math.floor(fechaHoraInicio);
        this.fechaHoraFin = oPreguntas.datos.fechaHoraFin;
        this.duracionMinutos = oPreguntas.datos.duracionMinutos;
        this.fechaHoraServidor = oPreguntas.datos.fechaHoraServidor;
        if (oPreguntas.datos.preguntas) {
          this.aQuestions = oPreguntas.datos.preguntas;
          this.aQuestions.filter(item => {
            if (item.tipoRespuesta === SELECCION_MULTIPLE) {
              this.answers = {
                ...this.answers,
                [item.id]: item.respuestas ? item.respuestas : []
              };
            }
            if (item.tipoRespuesta === SELECCION_SIMPLE) {
              this.answers = {
                ...this.answers,
                [item.id]: item.respuestas ? item.respuestas[0] : null
              };
            }
            if (item.tipoRespuesta === FALSO_VERDADERO) {
              this.answers = {
                ...this.answers,
                [item.id]: item.respuestas ? item.respuestas[0] : null
              };
            }
          });
          this.copySeleccion = { ...this.answers };
        }
        setTimeout(() => {
          this.step = 1;
          this.loading = true;
        }, 10);
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
.examen-online {
  .header {
    .titulo-header {
      color: $color1;
      font-weight: 500;
    }
  }

  .s__steps {
    max-width: 100px;
    min-width: 100px;
    width: 100px;
    padding: 4px !important;
    padding-top: 5px !important;
    background: transparent !important;
    border: none !important;
    & ~hr {
      max-width: 100px;
      min-width: 100px;
      width: 100px;
      &:last-child {
        display: none !important;
      }
    }
  }
  .number--step {
    background: $primary;
    color: $white;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin-left: 15px;
    border-radius: 7px;
    &:before {
      background: transparent;
      border: 2px solid $primary;
      content: "";
      position: absolute;
      display: block;
      z-index: 3;
      border-radius: 7px !important;
      top: -6px;
      left: 9px;
      right: 0;
      bottom: 0;
      pointer-events: none;
      width: 52px;
      height: 52px;
    }
  }
  .step-success, .step-error {
    .v-ripple__container {
      background: transparent !important;
      margin: auto;
      pointer-events: none;
    }
    & > span {
      background: $primary !important;
      border-radius: 7px !important;
      font-size: 1rem !important;
    }
  }
  .step-error {
    & > span {
      background: $white !important;
      color: $primary !important;
      font-weight: 600 !important;
      border-radius: 7px !important;
      font-size: 1rem !important;
    }
  }
  .v-stepper__step {
    background: transparent !important;
    border: none !important;
    max-width: 100px;
    min-width: 100px;
    width: 100px;
    .number {
      color: lighten($color: $black, $amount: 80) !important;
    }
  }
  .v-stepper__step--active {
    & > span {
      &:before {
        background: transparent;
        border: 2px solid $primary;
        content: "";
        position: absolute;
        border-radius: 7px !important;
        top: 0;
        left: 24px;
        right: 0;
        bottom: 0;
        pointer-events: none;
        width: 52px;
        height: 52px;
      }
    }
  }
  .v-stepper__step--inactive {
    & > span {
      &:before {
        background: transparent;
        border: none !important;
        content: "";
        position: absolute;
        border-radius: 7px !important;
        top: 0;
        left: 24px;
        right: 0;
        bottom: 0;
        pointer-events: none;
        width: 52px;
        height: 52px;
      }
    }
  }
  .seleccion--multiple,
  .seleccion--simple {
    label {
      color: $primary !important;
      font-weight: 500 !important;
    }
  }

  .grupo--falso_verdadero {
      .v-input--radio-group__input {
        .v-item--active {
          label {
            color: $primary !important;
            font-weight: 500 !important;
          }
        }
      }
    }

  .is--mobile {
    padding: 0;
    padding-top: 3px;
    padding-left: 5px;
    padding-right: 5px;
    & ~ hr {
      display: none !important;
    }
  }
  .is--desktop {
    .v-stepper__step__step {
      width: 40px;
      height: 40px;
    }
    & ~ hr {
      margin-top: 23px !important;
    }
  }

  .counter-enter-active, .counter-leave-active {
    transition: opacity .5s;
  }
  .counter-enter, .counter-leave-to {
    opacity: 0;
  }
}
</style>
