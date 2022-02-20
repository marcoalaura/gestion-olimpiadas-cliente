<template>
  <v-card color="backgroundColor" elevation="0" class="app-home">
    <v-card
      id="nombreEstudiante"
      elevation="0"
      color="backgroundColor"
      class="titulo-home d-flex flex-column align-center justify-center"
    >
      <v-img
        :max-width="120"
        :max-height="60"
        contain
        :src="$vuetify.theme.dark ? './img/logoUser.svg' : './img/logoUser.svg'"
        class="mb-5"
      />
      <span class="mt-3 font-weight-bold color7--text fs9">
        HOLA, {{ (nombreCompleto || '').toUpperCase() }}
      </span>
      <span class="mt-4 fs8 color7--text">
        ¡A continuación, podrás ver las áreas en las que te inscribiste!
      </span>
    </v-card>
    <!-- OLIMPIADAS -->
    <v-card elevation="0" width="100%" class="d-flex flex-row align-start justify-start mt-12">
      <v-skeleton-loader :loading="!logoOlimpiada" width="150" height="80" type="image">
        <v-img
          :max-width="['xs'].includes($vuetify.breakpoint.name) ? 100 : 150"
          :max-height="['xs'].includes($vuetify.breakpoint.name) ? 70 : 80"
          contain
          :src="logoOlimpiada"
        />
      </v-skeleton-loader>
      <section class="d-flex flex-column align-center justify-start">
        <section class="d-flex flex-row align-center flex-start">
          <v-input-autocomplete
            @value="e => mOlimpiada = e"
            label=""
            className="ml-1"
            :init="mOlimpiada"
            v-model="mOlimpiada"
            color="primary"
            :items="aOlimpiadas"
            @change="handleChangeOlimpiada"
            item-text="nombre"
            :hint="etapa ? `Etapa ${(etapa || '').toLowerCase()}` : 'ACTIVO'"
            persistent-hint
            :append-icon="ICONS.expand_more"
            item-value="id"
            dense
          >
          </v-input-autocomplete>
          <v-icon-tooltip
            color="primary"
            className="mb-4"
            icon="refresh"
            text="Actualizar listado de pruebas"
            @accion="getAreas"
          />

        </section>
      </section>
    </v-card>
    <!-- OLIMPIADA ACTUAL -->
    <v-card elevation="0" id="contenedor" class="w100">
      <div class="fs8 mt-5 ml-6 color7--text" :style="aAreas.length > 0 ? '' : 'visibility: hidden'">Pruebas:</div>
      <v-card elevation="0" class="d-flex flex-row align-center justify-space-between w100 flex-wrap" style="margin: auto; padding: 20px 10px !important;" align="center">
        <template v-if="aAreas.length === 0">
          <v-col cols="12">
            <v-card elevation="0" :min-height="40" class="d-flex flex-row align-center justify-center">
              <span>No existen asignaturas que seleccionar</span>
            </v-card>
            <v-divider style="width: 300px" class="separator"/>
            <section class="d-flex flex-row align-center justify-center mt-3">
              <v-btn
                :class="historial ? 'error--text' : 'primary--text'"
                @click="getHistoricos"
                height="30"
                text
                link
                style="text-transform: none"
                depressed
                outlined
              >{{ historial ? 'Ocultar mi historial de participación' : 'Ver mi historial de participación'}}</v-btn>
            </section>
          </v-col>
        </template>
        <template v-else>
          <div
            v-for="area in aAreas"
            :key="area.idExamen"
            align="center"
            @click="iniciarExamen(area)"
            class="area--section cursor--pointer mb-4"
            :class="{
              w49: !['xs', 'sm'].includes($vuetify.breakpoint.name),
              w100: ['xs', 'sm'].includes($vuetify.breakpoint.name)
            }"
          >
            <div elevation="0" class="d-flex flex-row align-center">
              <!-- LOGO DE LA ASIGNATURA -->
              <v-img
                :max-width="50"
                :max-height="50"
                contain
                :src="area.logo"
              />
                <div elevation="0" class="d-flex flex-row align-center justify-center w100">
                  <div class="ml-5 d-flex flex-column align-start justify-center w90" :style="['xs'].includes($vuetify.breakpoint.name) ? '' : ''">
                    <div class="area--name fs9 primary--text font-weight-bold d-flex flex-row align-center justify-center">
                      <span>{{ toCapitalize((area.area || '').toLowerCase()) }}</span>
                      <span class="fs9 primary--text font-weight-bold">({{ toCapitalize(((area.estado === 'TIMEOUT' ? 'TIEMPO FINALIZADO' : area.estado).replace('_', ' ') || '').toLowerCase()) }})</span>
                    </div>
                    <div class="fs9 primary--text font-weight-bold">{{ toCapitalize((area.gradoEscolar || '').toLowerCase()) }}</div>
                    <div elevation="0" class="d-flex flex-column align-start user--select fs8">
                      <span :class="getStatusClass(area.estado)" style="text-align: left">
                        Inicia el {{ $datetime.format('DD/MM/YYYY', new Date(area.fechaHoraInicio)) }}
                        a las {{ $datetime.getHour(new Date(area.fechaHoraInicio)) }}:{{ $datetime.getMinutes(new Date(area.fechaHoraInicio)) }}
                        y termina el {{ $datetime.format('DD/MM/YYYY', new Date(area.fechaHoraFin)) }}
                        a las {{ $datetime.getHour(new Date(area.fechaHoraFin)) }}:{{ $datetime.getMinutes(new Date(area.fechaHoraFin)) }}
                      </span>
                      <span :class="getStatusClass(area.estado)" style="text-align: left">
                        Duración de la prueba: {{ area.duracionMinutos }} minutos
                      </span>
                    </div>
                  </div>
                  <v-icon-component icon="chevron_right" className="color7--text"></v-icon-component>
                </div>
              </div>
            </div>
        </template>
      </v-card>
      <template v-if="aAreas.length > 0">
        <v-divider class="separator2"/>
        <section class="d-flex flex-row align-center justify-center mt-3 mb-3">
          <v-btn
            :class="historial ? 'error--text' : 'primary--text'"
            @click="getHistoricos"
            height="30"
            text
            link
            style="text-transform: none"
            depressed
            outlined
          >{{ historial ? 'Ocultar mi historial de participación' : 'Ver mi historial de participación'}}</v-btn>
        </section>
      </template>
    </v-card>
    <!-- OLIMPIADAS ANTERIORES -->
    <v-card elevation="0" id="contenedor-historial" v-if="historial">
      <section class="fs8 mt-5 ml-3 color7--text d-flex flex-row align-center justify-start">
        <v-icon-component icon="history"/>
        <span class="color7--text">Pruebas:</span>
      </section>
      <template>
        <v-card elevation="0" class="d-flex flex-row align-center justify-space-between w100 flex-wrap" style="margin: auto; padding: 20px 10px !important;" align="center">
          <div
            v-for="area in aHistorial"
            :key="area.idExamen"
            align="center"
            @click="verExamenPasado(area)"
            class="area--section cursor--pointer mb-4"
            :class="{
              w49: !['xs', 'sm'].includes($vuetify.breakpoint.name),
              w100: ['xs', 'sm'].includes($vuetify.breakpoint.name)
            }"
          >
            <div elevation="0" class="d-flex flex-row align-center">
              <!-- LOGO DE LA ASIGNATURA -->
              <v-img
                :max-width="50"
                :max-height="50"
                contain
                :src="area.logo"
              />
              <div elevation="0" class="d-flex flex-row align-center justify-center w100">
                <div class="ml-5 d-flex flex-column align-start justify-center w90" :style="['xs'].includes($vuetify.breakpoint.name) ? '' : ''">
                  <div class="area--name fs9 primary--text font-weight-bold mb-2">
                    {{ toCapitalize((area.olimpiada || '').toLowerCase()) }}
                  </div>
                  <div class="area--name fs9 primary--text font-weight-bold">
                    {{ toCapitalize((area.area || '').toLowerCase()) }}
                    ({{ area.tipoPrueba }})
                  </div>
                  <div class="fs9 primary--text font-weight-bold">{{ toCapitalize((area.gradoEscolar || '').toLowerCase()) }}</div>
                  <div elevation="0" class="d-flex flex-column align-start user--select fs8">
                    <span :class="getStatusClass(area.estado)">{{ toCapitalize(((area.estado === 'TIMEOUT' ? 'TIEMPO FINALIZADO' : area.estado).replace('_', '') || '').toLowerCase()) }}</span>
                  </div>
                  <div elevation="0" class="d-flex flex-column align-start user--select fs8">
                    <span :class="getStatusClass(area.estado)" style="text-align: left">
                      <template v-if="!area.fechaInicio">
                        No inició -
                      </template>
                      <template v-else>
                        Inició el {{ $datetime.format('DD/MM/YYYY', new Date(area.fechaInicio)) }}
                        a las {{ $datetime.getHour(new Date(area.fechaInicio)) }}:{{ $datetime.getMinutes(new Date(area.fechaInicio)) }}
                      </template>

                      <template v-if="!area.fechaFin">
                        No finalizó
                      </template>
                      <template v-else>
                        y terminó el {{ $datetime.format('DD/MM/YYYY', new Date(area.fechaFin)) }}
                        a las {{ $datetime.getHour(new Date(area.fechaFin)) }}:{{ $datetime.getMinutes(new Date(area.fechaFin)) }}
                      </template>
                    </span>
                    <span :class="getStatusClass(area.estado)" style="text-align: left" v-if="area.duracionMinutosEstudiante">
                      La prueba tuvo una duración de {{ Math.round(area.duracionMinutosEstudiante) }} minutos
                    </span>
                  </div>
                </div>
                <v-icon-component icon="chevron_right" className="color7--text"></v-icon-component>
              </div>
            </div>
          </div>
        </v-card>
      </template>
    </v-card>
    <!-- MODAL DE TERMINOS Y CONDICIONES -->
    <v-dialog scrollable v-model="$store.state.modal2" persistent fullscreen>
      <terminos-condiciones step="TERMINOS_CONDICIONES" @obtener-preguntas="obtenerPreguntas"/>
    </v-dialog>
    <v-dialog scrollable v-model="$store.state.modal5" persistent fullscreen>
      <terminos-condiciones step="EXAMEN_FINALIZADO" :data="data" :examenPasado="examenPasado" @generate="generate" @revisarExamen="revisarExamen"/>
    </v-dialog>
    <v-dialog scrollable fullscreen transition="dialog-bottom-transition" v-model="$store.state.modal7" :width="500">
      <respuestas
        :key="Math.random() * 1000"
        v-if="$store.state.modal7"
        :idExamen="materiaSeleccionada.idExamen"
        :areaGradoEscolar="materiaSeleccionada.gradoEscolar"
        :area="materiaSeleccionada.area"
      />
    </v-dialog>
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
  </v-card>
</template>

<script>
import jspdf from '../examenOnline/mixins/pdf';
import img from '../examenOnline/img';
import terminosCondiciones from './modalExamen.vue';
import respuestas from '../examenOnline/respuestasExamenOnline.vue';

const HABILITADO = 'HABILITADO';
const ACTIVO = 'ACTIVO';
const EN_PROCESO = 'EN_PROCESO';
const FINALIZADO = 'FINALIZADO';
const TIMEOUT = 'TIMEOUT';
const ANULADO = 'ANULADO';
const INSCRITO = 'INSCRITO';

const PUBLICACION_RESPUESTAS = 'PUBLICACION_RESPUESTAS';
const IMPUGNACION_PREGUNTAS_RESPUESTAS = 'IMPUGNACION_PREGUNTAS_RESPUESTAS';
const OBTENCION_MEDALLERO = 'OBTENCION_MEDALLERO';
const DESEMPATE = 'DESEMPATE';
const GENERAR_CLASIFICADOS = 'GENERAR_CLASIFICADOS';
const PUBLICACION_RESULTADOS = 'PUBLICACION_RESULTADOS';

export default {
  mixins: [jspdf],
  data: () => ({
    aAreas: [],
    user: null,
    rol: null,
    aOlimpiadas: [],
    mOlimpiada: null,
    logoOlimpiada: null,
    olimpiada: {},
    historial: false,
    show: false,
    showPDF: null,
    materiaSeleccionada: null,
    data: null,
    minMilis: null,
    etapa: '',
    examenPasado: false,
    aHistorial: [],
    startDateMilis: null,
    interval: null,
    IMG_LOGO: img,
    HABILITADO: HABILITADO,
    ACTIVO: ACTIVO,
    EN_PROCESO: EN_PROCESO,
    FINALIZADO: FINALIZADO,
    TIMEOUT: TIMEOUT,
    ANULADO: ANULADO,
    INSCRITO: INSCRITO,
    PUBLICACION_RESPUESTAS: PUBLICACION_RESPUESTAS,
    IMPUGNACION_PREGUNTAS_RESPUESTAS: IMPUGNACION_PREGUNTAS_RESPUESTAS,
    OBTENCION_MEDALLERO: OBTENCION_MEDALLERO,
    DESEMPATE: DESEMPATE,
    GENERAR_CLASIFICADOS: GENERAR_CLASIFICADOS,
    PUBLICACION_RESULTADOS: PUBLICACION_RESULTADOS
  }),
  components: {
    terminosCondiciones,
    respuestas,
  },
  computed: {
    nombreCompleto () {
      const nombre = this.toCapitalize((this.user && this.user.nombres ? this.user.nombres : '').toLowerCase());
      const apellidoPaterno = this.toCapitalize((this.user && this.user.primerApellido ? this.user && this.user.primerApellido : '').toLowerCase());
      const apellidoMaterno = this.toCapitalize((this.user && this.user.segundoApellido ? this.user && this.user.segundoApellido : '').toLowerCase());
      return `${nombre} ${apellidoPaterno} ${apellidoMaterno}`;
    }
  },
  mounted() {
    this.$nextTick(async () => {
      clearInterval(this.interval);
      this.user = this.$storage.getUser();
      this.rol = this.$storage.get('rol');
      await this.getOlimpiadas();
      await this.getAreas();
    });
  },
  destroyed () {
    clearInterval(this.interval);
  },
  methods: {
    verExamenPasado (subItem) {
      this.materiaSeleccionada = subItem;
      if ([this.FINALIZADO, this.TIMEOUT].includes(subItem.estado)) {
        this.data = subItem;
        this.examenPasado = true;
        this.$storage.set('area', this.materiaSeleccionada.area);
        this.$store.commit('openModal', 5);
      } else {
        this.$message.error(`Solo se puede ver las pruebas en estado ${this.FINALIZADO} y ${this.TIMEOUT}`);
      }
    },
    async getHistoricos () {
      try {
        if (!this.historial) {
          const historicos = await this.$service.get(`estudiantes/${this.$storage.get('id')}/examenes/historicos`);
          if (historicos && historicos.isOK) {
            this.aHistorial = historicos.datos && historicos.datos.filas ? historicos.datos.filas : [];
            if (this.aHistorial.length > 0) this.historial = true;
          }
        } else {
          this.historial = !this.historial;
        }
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    async revisarExamen () {
      let examenPasado;
      let valid = false;
      if (this.examenPasado) {
        examenPasado = await this.$service.get(`examenes/${this.materiaSeleccionada.idExamen || this.$storage.get('idExamen')}/calificacion`);
        valid = examenPasado && examenPasado.isOK;
      }
      if ([this.PUBLICACION_RESPUESTAS].includes(this.materiaSeleccionada.etapaEstado) || valid) {
        this.$store.commit('openModal', 7);
      } else {
        this.$message.error(examenPasado ? examenPasado.mensaje : `Error, todavia no se encuentra en el estado ${this.PUBLICACION_RESPUESTAS} para revisar los resultados`);
      }
    },
    async generate ({ idExamen }) {
      try {
        this.$waiting(true, 'Espere unos segundos por favor mientras se genera su comprobante...');
        const response = await this.$service.get(`examenes/${idExamen}/comprobantes`);
        this.olimpiada = response.datos;
        this.$storage.set('rude', this.olimpiada.rude);
        this.initPDF();
        setTimeout(() => {
          const html = document.querySelector('#container');
          this.generatePDF(html);
        }, 200);
      } catch (error) {
        this.$waiting(false);
        this.$message.error(error.message);
      }
    },
    toCapitalize(str) {
      return str?.split('').map((e, i) => (i === 0 ? e.toUpperCase() : e)).join('');
    },
    async handleChangeOlimpiada () {
      this.minMilis = null;
      this.startDateMilis = null;
      const logoOlimpiada = this.aOlimpiadas.find(item => item.id === this.mOlimpiada);
      if (logoOlimpiada) this.logoOlimpiada = logoOlimpiada.logo;
      clearInterval(this.interval);
      await this.getAreas();
    },
    getOlimpiadas () {
      return new Promise(async (resolve, reject) => {
        try {
          const olimpiadas = await this.$service.get(`estudiantes/${this.$storage.get('id')}/olimpiadas`);
          if (olimpiadas && olimpiadas.isOK) {
            this.aOlimpiadas = olimpiadas.datos ?? [];
            this.mOlimpiada = this.aOlimpiadas.length > 0 ? this.aOlimpiadas[0].id : null;
            const logoOlimpiada = this.aOlimpiadas.find(item => item.id === this.mOlimpiada);
            if (logoOlimpiada) this.logoOlimpiada = logoOlimpiada.logo;
          }
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
    requestXTime () {
      return new Promise((resolve, reject) => {
        try {
          const startDate = new Date(this.minMilis);
          const endDate = new Date(this.startDateMilis);
          this.interval = setInterval(() => {
            startDate.setSeconds(startDate.getSeconds() + 1);
            if (startDate.getTime() === endDate.getTime()) {
              clearInterval(this.interval);
            }
          }, 1000);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
    getAreas () {
      return new Promise(async (resolve, reject) => {
        try {
          if (this.mOlimpiada) {
            const examenes = await this.$service.get(`estudiantes/${this.$storage.get('id')}/examenes?idOlimpiada=${this.mOlimpiada}`);
            this.aAreas = examenes.datos.filas.map(examen => {
              const obj = { ...examen };
              obj.label = examen.areaNombre;
              obj.nombre = examen.areaNombre;
              obj.url = '/examen';
              if (!this.minMilis) this.minMilis = examen.iniciaEnXMilis;
              if (examen.iniciaEnXMilis < this.minMilis) {
                this.minMilis = examen.iniciaEnXMilis;
                this.startDateMilis = examen.fechaHoraInicio;
              }
              return obj;
            });
          } else {
            this.aAreas = [];
          }
          // if (this.minMilis) await this.requestXTime();
          this.etapa = this.aAreas.length > 0 ? this.aAreas[0].etapa : '';
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
    getStatusClass (estado) {
      let className = '';
      if ([this.HABILITADO, this.ACTIVO].includes(estado)) {
        className = 'info--text examen-listo fs9';
      } else if ([this.EN_PROCESO, this.FINALIZADO].includes(estado)) {
        className = 'info--text examen-listo fs9';
      } else {
        className = 'error--text examen-espera fs9';
      }
      return className;
    },
    getDescriptionClass (estado) {
      let className = '';
      if ([this.HABILITADO, this.ACTIVO].includes(estado)) {
        className = 'success--text fs8';
      } else if ([this.EN_PROCESO, this.FINALIZADO].includes(estado)) {
        className = 'info--text fs8';
      } else {
        className = 'error--text fs8';
      }
      return className;
    },
    initDate ({ fechaHoraInicio }) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(fechaHoraInicio);
      const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
      const minutes = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
      const ampm = parseInt(hours) >= 12 ? 'pm' : 'am';
      return `Se abre el ${date.toLocaleDateString('es-ES', options)} a las ${hours}:${minutes} ${ampm}`;
    },
    endDate ({ fechaHoraFin }) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(fechaHoraFin);
      const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
      const minutes = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
      const ampm = parseInt(hours) >= 12 ? 'pm' : 'am';
      return `Se cierra el ${date.toLocaleDateString('es-ES', options)} a las ${hours}:${minutes} ${ampm}`;
    },
    async obtenerPreguntas () {
      try {
        const response = await this.$service.patch(`examenes/${this.materiaSeleccionada.idExamen}/iniciar`);
        if (response && response.isOK) {
          this.$storage.set('idExamen', this.materiaSeleccionada.idExamen);
          this.$storage.set('area', this.materiaSeleccionada.area);
          this.$storage.set('logo', this.materiaSeleccionada.logo);
          this.$storage.set('areaGradoEscolar', this.materiaSeleccionada.gradoEscolar);
          this.redirect(this.materiaSeleccionada);
        } else {
          throw new Error(response.mensaje);
        }
      } catch (error) {
        this.$message.error(error.message || 'Problemas de conexion');
      }
    },
    iniciarExamen (subItem) {
      this.materiaSeleccionada = subItem;
      this.examenPasado = false;
      if (subItem.estado === this.ACTIVO) {
        this.$store.commit('openModal', 2);
      } else if (subItem.estado === this.EN_PROCESO) {
        this.$storage.set('idExamen', this.materiaSeleccionada.idExamen);
        this.$storage.set('area', this.materiaSeleccionada.area);
        this.$storage.set('logo', this.materiaSeleccionada.logo);
        this.$storage.set('areaGradoEscolar', this.materiaSeleccionada.gradoEscolar);
        this.$router.push({
          name: 'Examen',
          params: {
            idExamen: this.materiaSeleccionada.idExamen,
            area: this.materiaSeleccionada.area,
            logo: this.materiaSeleccionada.logo,
            areaGradoEscolar: this.materiaSeleccionada.gradoEscolar,
          }
        });
      } else if ([this.HABILITADO, this.INSCRITO].includes(subItem.estado)) {
        this.$message.error('La prueba se iniciara de acuerdo al cronograma establecido en la descripcion de la asignatura.');
      } else if ([this.FINALIZADO, this.TIMEOUT].includes(subItem.estado)) {
        this.data = subItem;
        this.$storage.set('area', this.materiaSeleccionada.area);
        this.$store.commit('openModal', 5);
      }
    },
    redirect(subItem) {
      this.apps = false;
      if (subItem && subItem.hasOwnProperty('url')) {
        if (this.$route.path.replace(/\//gi, '') !== subItem.url) {
          this.$router.push({
            name: 'Examen',
            params: {
              idExamen: this.materiaSeleccionada.idExamen
            }
          });
        }
      }
    }
  }
};
</script>

<style lang="scss">
.titulo-home {
  width: 95%;
  margin: auto;
  font-size: 1.2rem;
  padding-top: 30px;
  letter-spacing: 0;
  user-select: none;
  text-align: center;
}

.app-home {
  margin: auto;
  height: 100%;
  width: 90%;
}

.area--section {
  border: 1px solid #D3DBE6;
  border-radius: 10px !important;
  padding: 10px;
}

.examen-listo {
  font-weight: 500;
}

.examen-espera {
  font-weight: 500;
}

.area--name {
  margin-top: -8px;
  user-select: none;
}

.separator {
  &::after {
    content: 'O';
    width: 10px;
    height: 10px;
    position: absolute;
    top: 63px;
  }
}
.separator2 {
  &::after {
    content: 'O';
    width: 10px;
    height: 10px;
    position: absolute;
    margin-top: -9px;
    left: 50%;
  }
}
</style>
