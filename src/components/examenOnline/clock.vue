<template>
  <v-card elevation="0" class="time pa-2">
    <v-progress-circular
      striped
      :rotate="-90"
      :color="nivel === 1 ? 'primary' : nivel === 2 ? 'warning' : 'error'"
      :class="nivel === 3 ? '' : ''"
      height="7px"
      :width="5"
      :size="70"
      :value="mProgressLinear"
    >
    <div class="d-flex flex-column align-center justify-center w100">
      <span
        class="fs8 font-weight-bold"
        :class="{
          'primary--text': nivel === 1,
          'warning--text': nivel === 2,
          'error--text': nivel === 3
        }"
      >
        {{ decrementHours }}:{{ decrementMinutes }}:{{ decrementSeconds }}
      </span>
    </div>
    </v-progress-circular>
  </v-card>
</template>
<script>
import dayjs from 'dayjs';

export default {
  props: {
    fechaHoraInicio: {
      type: Number,
      default: 0
    },
    fechaHoraFin: {
      type: Number,
      default: 0
    },
    fechaHoraServidor: {
      type: Number,
      default: 0
    },
    duracionMinutos: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    interval: null,
    startDate: null,
    endDate: null,
    incrementDate: null,
    className: 'success--text',
    milliseconds: null,
    millisecondsInitial: null,
    mProgressLinear: 0,
    nivel: 1,
    decrementSeconds: null,
    decrementMinutes: null,
    decrementHours: null
  }),
  created () {
    const startDate = new Date(this.fechaHoraInicio);
    const endDate = new Date(this.fechaHoraFin);

    const incrementDate = new Date(this.fechaHoraServidor);
    this.startDate = dayjs(startDate).format('HH:mm:ss A');
    this.endDate = dayjs(endDate).format('HH:mm:ss');
    this.milliseconds = dayjs(endDate).diff(startDate);
    this.decrementSeconds = 59;
    const { hours, minutes } = this.timeDiffCalc(endDate, startDate);
    this.decrementHours = hours;
    this.decrementMinutes = minutes;

    this.millisecondsInitial = dayjs(endDate).diff(startDate);
    this.interval = setInterval(() => {
      startDate.setSeconds(startDate.getSeconds() + 1);
      incrementDate.setSeconds(incrementDate.getSeconds() + 1);
      const timer = incrementDate.setDate(incrementDate.getDate() - 1);
      this.incrementDate = dayjs(timer).format('HH:mm:ss');
      this.startDate = dayjs(startDate).format('HH:mm:ss A');
      this.milliseconds = dayjs(endDate).diff(startDate);
      if (parseInt(this.decrementMinutes) === 0 && parseInt(this.decrementSeconds) === 0) {
        this.decrementMinutes = 60;
        this.decrementHours = parseInt(this.decrementHours) > 0 ? parseInt(this.decrementHours) - 1 : 0;
        this.decrementHours = parseInt(this.decrementHours) < 10 ? `0${this.decrementHours}` : this.decrementHours;
      }
      if (parseInt(this.decrementSeconds) === 0) {
        this.decrementSeconds = 60;
        this.decrementMinutes = this.decrementMinutes > 0 ? parseInt(this.decrementMinutes) - 1 : 0;
        this.decrementMinutes = parseInt(this.decrementMinutes) < 10 ? `0${this.decrementMinutes}` : this.decrementMinutes;
      }
      this.decrementSeconds = this.decrementSeconds - 1;
      this.decrementSeconds = this.decrementSeconds > 9 ? this.decrementSeconds : `0${this.decrementSeconds}`;
      this.mProgressLinear = Math.abs((parseInt((this.milliseconds * 100) / this.millisecondsInitial)) - 100);
      this.className = this.mProgressLinear > 80 ? 'error--text' : this.mProgressLinear > 60 ? 'warning--text' : 'success--text';
      this.nivel = this.mProgressLinear > 80 ? 3 : this.mProgressLinear > 60 ? 2 : 1;
      this.$storage.set('hours', this.decrementHours);
      this.$storage.set('time', this.decrementMinutes);
      if (this.milliseconds === 0 || this.milliseconds < 0) {
        clearInterval(this.interval);
        this.decrementMinutes = '00';
        this.decrementHours = '00';
        this.decrementSeconds = '00';
        this.$alert('El tiempo de la prueba concluyó', () => {
          this.$emit('end', true);
        });
      }
    }, 1000);
  },
  methods: {
    timeDiffCalc(dateFuture, dateNow) {
      let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

      // calculate days
      const days = Math.floor(diffInMilliSeconds / 86400);
      diffInMilliSeconds -= days * 86400;

      // calculate hours
      let hours = Math.floor(diffInMilliSeconds / 3600) % 24;
      hours = hours < 10 ? `0${hours}` : hours;
      diffInMilliSeconds -= hours * 3600;

      // calculate minutes
      let minutes = Math.floor(diffInMilliSeconds / 60) % 60;
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      diffInMilliSeconds -= minutes * 60;

      return {
        hours,
        minutes
      };
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>
<style lang="scss">
  @import '../../scss/variables.scss';
  .time {
    font-family: $fontFamilyMontserrat;
    font-size: 17px;
    letter-spacing: 0;
    font-weight: 500;
    user-select: none;
  }
  .increasing {
    animation: increasing .7s infinite ease-in;
  }
  @keyframes increasing {
    0% {
      transform: scale(1);
    }

    20% {
      transform: scale(1.05);
    }

    50% {
      transform: scale(1.1);
    }

    80% {
      transform: scale(1.05);
    }

    100% {
      transform: scale(1);
    }
  }
</style>
