<template>
  <v-card
    elevation="0"
    class="encuesta d-flex flex-column align-center"
    :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'pa-2 justify-start' : 'pa-5 justify-center'"
  >
    <v-btn
      class="primary--text"
      fab
      small
      top
      depressed
      text
      right
      fixed
      v-if="step !== 'PRUEBA_FINALIZADA'"
      @click="cerrarModal"
    >
      <v-icon-component icon="close" :size="35"/>
    </v-btn>
    <template v-if="step === 'TERMINOS_CONDICIONES'">
      <v-card
        elevation="0"
        class="pa-5"
        :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'width: 100%; max-width: 100%' : 'width: 50%; max-width: 50%'"
      >
        <div class="color1--text fs11 pb-5 d-flex flex-row align-center justify-center font-weight-bold" :class="{
          'mt-5': !['xs'].includes($vuetify.breakpoint.name),
          'mt-15': ['xs'].includes($vuetify.breakpoint.name)
        }">
          <span>Instrucciones</span>
        </div>

        <v-card elevation="0" class="d-flex flex-column align-start justify-start">
          <section class="pl-o color7--text mb-4 ml-15">Al empezar la prueba aceptas que leíste las instrucciones</section>

          <section class="font-weight-light fs10 d-flex flex-row mt-3">
            <v-icon-component icon="timer" className="primary--text" :size="35"></v-icon-component>
            <div class="f-flex flex-column aling-center justify-center ml-4">
              <div class="primary--text font-weight-bold fs9">Tiempo de la prueba</div>
              <div class="fs9 color7--text">La prueba tiene una duración establecida, pasado ese tiempo se cerrará automáticamente</div>
            </div>
          </section>

          <section class="font-weight-light fs10 d-flex flex-row mt-5">
            <v-icon-component icon="quiz" className="primary--text" :size="35"></v-icon-component>
            <div class="f-flex flex-column aling-center justify-center ml-4">
              <div class="primary--text font-weight-bold fs9">Cantidad de preguntas</div>
              <div class="fs9 color7--text">La prueba consiste en varias preguntas de selección múltiple, selección simple y de falso o verdadero</div>
            </div>
          </section>

          <section class="font-weight-light fs10 d-flex flex-row mt-5">
            <v-icon-component icon="mark_chat_read" className="primary--text" :size="35"></v-icon-component>
            <div class="f-flex flex-column aling-center justify-center ml-4">
              <div class="primary--text font-weight-bold fs9">Número de intentos</div>
              <div class="fs9 color7--text">Solo tienes una oportunidad para dar la prueba, si cierras la ventana del navegador podrás continuar con la prueba siempre y cuando este en curso</div>
            </div>
          </section>

          <section class="font-weight-light fs10 d-flex flex-row mt-5">
            <v-icon-component icon="warning" className="primary--text" :size="35"></v-icon-component>
            <div class="f-flex flex-column aling-center justify-center ml-4">
              <div class="primary--text font-weight-bold fs9">Invalidación de la prueba</div>
              <div class="fs9 color7--text">
                No debes difundir fotos o capturas de la prueba por ningún medio <br/>
                La prueba es individual, no esta permitido recibir ayuda
              </div>
            </div>
          </section>
        </v-card>
        <v-card elevation="0" class="w100 d-flex flex-row mt-8 align-center justify-center">
          <v-btn
            color="primary"
            depressed
            class="ma-1 font-weight-bold"
            style="text-transform: none"
            @click="empezarExamen"
          >
            Empezar
          </v-btn>
        </v-card>

      </v-card>
    </template>
    <template v-if="step === 'STEPS_MOBILE'">
      <v-card elevation="0" class="pa-5" :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'width: 100%; max-width: 100%' : 'width: 40%; max-width: 40%'">
        <div class="color1--text fs11 pb-10 d-flex flex-row align-center justify-center font-weight-bold">Navegación de preguntas</div>

        <section elevation="0" class="d-flex flex-row align-center justify-center flex-wrap w100 text-center">
          <section
            v-for="(question, i) in questions" :key="question.id"
            class="box-question-mobile cursor--pointer"
            :class="isChecked(question, i + 1)"
            @click="goToStep(i + 1)"
          >
            {{ i+1 }}
          </section>
        </section>

      </v-card>
    </template>
    <template v-if="step === 'RESUMEN'">
      <v-card elevation="0" class="pa-5" :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'width: 100%; max-width: 100%' : 'width: 70%; max-width: 70%'">
        <div class="color1--text fs11 pb-5 d-flex flex-row align-center justify-center font-weight-bold">Resumen</div>

        <v-card elevation="0" class="d-flex flex-column align-center justify-center w100">
          <section class="pl-o color7--text mb-4">Tiene {{ questionsNotResponding }} preguntas sin responder, si finalizas la prueba no podrás hacer cambios</section>
        </v-card>

        <v-card elevation="0" class="d-flex flex-row align-center justify-center mb-7">
          <v-icon-component icon="hourglass_top"></v-icon-component>
          <section class="pl-o color7--text">Todavía tienes {{ time }} minutos</section>
        </v-card>

        <section elevation="0" class="d-flex flex-row align-center justify-center flex-wrap w100 text-center">
          <section
            v-for="(question, i) in questions" :key="question.id"
            class="box-question cursor--pointer"
            :class="isChecked(question)"
            @click="goToStep(i + 1)"
          >
            {{ i+1 }}
          </section>
        </section>

        <v-card elevation="0" class="w100 d-flex flex-row mt-8 align-center justify-center">
          <v-btn
            color="info"
            depressed
            class="ma-1 font-weight-bold"
            style="text-transform: none"
            @click="$store.commit('closeModal', 3)"
          >
            Regresar
          </v-btn>
          <v-btn
            color="primary"
            depressed
            class="ma-1 font-weight-bold"
            style="text-transform: none"
            @click="$emit('finish')"
          >
            Finalizar
          </v-btn>
        </v-card>
      </v-card>
    </template>
    <template v-if="step === 'PRUEBA_FINALIZADA'">
      <v-card elevation="0" class="pa-5" :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'width: 100%; max-width: 100%' : 'width: 40%; max-width: 40%'">
        <div class="color1--text fs11 pb-5 d-flex flex-row align-center justify-center font-weight-bold">Prueba Finalizada</div>

        <v-card elevation="0" class="d-flex flex-column align-center justify-center w100">
          <section class="pl-o color7--text mb-4">Recibimos tus respuestas, en unos días publicaremos los resultados</section>
        </v-card>

        <v-card elevation="0" class="d-flex flex-row align-center justify-center mb-7 cursor--pointer" @click="$emit('generate')">
          <v-icon-component icon="file_download" className="primary--text"></v-icon-component>
          <section class="pl-o primary--text ml-2">Descargar el comprobante de la prueba</section>
        </v-card>
      </v-card>
      <v-card elevation="0" class="w100 d-flex flex-row mt-8 align-center justify-center">
        <v-btn
          color="primary"
          depressed
          class="ma-1 font-weight-bold"
          style="text-transform: none"
          @click="$emit('home')"
        >
          Terminar
        </v-btn>
      </v-card>
    </template>
    <template v-if="step === 'EXAMEN_FINALIZADO'">
      <v-card elevation="0" class="pa-5" :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'width: 100%; max-width: 100%' : 'width: 40%; max-width: 40%'">
        <div class="color1--text fs11 pb-5 d-flex flex-row align-center justify-center font-weight-bold">Información</div>

        <v-card elevation="0" class="d-flex flex-row align-center justify-center w100">
          <section class="pl-o color7--text mb-4">La prueba de {{ (data.area || '').toLowerCase()}} de {{ (data.gradoEscolar || '').toLowerCase()}} a finalizado, en unos días publicaremos los resultados.</section>
        </v-card>

        <v-card elevation="0" class="d-flex flex-row align-center justify-start w100">
          <section class="pl-o color7--text mb-4">A continuación, puedes realizar las siguientes acciones:</section>
        </v-card>

        <v-card elevation="0" class="d-flex flex-row align-center justify-start mb-7 cursor--pointer" @click="$emit('generate', { idExamen : data.idExamen })">
          <v-icon-component icon="file_download" className="primary--text"></v-icon-component>
          <section class="pl-o primary--text ml-2">Descargar el comprobante de la prueba</section>
        </v-card>

        <v-card elevation="0" class="d-flex flex-row align-center justify-start mb-7 cursor--pointer" @click="$emit('revisarExamen')">
          <v-icon-component icon="grading" className="primary--text"></v-icon-component>
          <section class="pl-o primary--text ml-2">Revisar las respuestas</section>
        </v-card>
      </v-card>

      <v-card elevation="0" class="w100 d-flex flex-row align-center justify-center">
        <v-btn
          color="primary"
          depressed
          class="ma-1 font-weight-bold"
          style="text-transform: none"
          @click="cerrarModal"
        >
          Aceptar
        </v-btn>
      </v-card>

    </template>

  </v-card>
</template>
<script>

export default {
  props: {
    step: {
      type: String,
      default: ''
    },
    questions: {
      type: Array,
      default: () => []
    },
    answers: {
      type: Object,
      default: () => {}
    },
    questionsNotResponding: {
      type: Number,
      default: 0
    },
    currentStep: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    time: null,
    settings: {}
  }),
  methods: {
    goToStep (step) {
      this.$emit('go', step);
    },
    isChecked ({ id }, index = null) {
      let css = 'not--answer';
      if (this.answers[id] && Array.isArray(this.answers[id]) && this.answers.length > 0) css = '';
      if ((this.answers[id] || '').length > 0) css = '';
      css += index === this.currentStep ? '' : '';
      return css;
    },
    empezarExamen () {
      this.$store.commit('closeModal', 2);
      this.$emit('obtener-preguntas', []);
    },
    cerrarModal () {
      this.$store.commit('closeModal', 2);
      this.$store.commit('closeModal', 3);
      this.$store.commit('closeModal', 4);
      this.$store.commit('closeModal', 5);
      this.$store.commit('closeModal', 6);
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.time = `${this.$storage.get('hours')} horas con ${this.$storage.get('time')}`;
    });
  }
};
</script>
<style lang="scss" scoped>
@import '../../scss/variables.scss';
.box-question {
  width: 50px;
  height: 50px;
  color: $white;
  background: $primary;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 7px;
  font-size: 1rem;
  border: 1px solid $primary;
}
.box-question-mobile {
  width: 60px;
  height: 60px;
  color: $white;
  background: $primary;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 7px;
  font-size: 1rem;
  border: 1px solid $primary;
}
.double {
  border: 7px double $primary !important;
}
.not--answer {
  background: $white;
  color: $primary;
  border: 1px solid $primary;
}
.encuesta {
  width: 100%;
  height: 100vh;
  margin: auto;
  .titulo {
    text-align: center;
    font-weight: 500;
    user-select: none;
    letter-spacing: -1px;
  }
}
</style>
