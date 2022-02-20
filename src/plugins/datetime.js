import store from '@/store';
import dayjs from 'dayjs';

export default {
  store,
  install: Vue => {
    const DatetimeService = {
      /**
       * @author dbarra
       * @description formatea una fecha
       * @param { sFormat } DD/MM/YYYY
       * @param { date } 2021-10-10
       */
      format(sFormat, date) {
        return dayjs(date).format(sFormat);
      },
      /**
       * @author dbarra
       * @description Retorna la hora de la fecha enviada
       * @returns { Number }
       * @param { date } date fecha validada por ejemplo usando new Date()
       */
      getHour(date) {
        let hour = dayjs(date).hour();
        hour = hour > 9 ? hour : `0${hour}`;
        return hour;
      },
      /**
       * @author dbarra
       * @description Retorna los minutos de la fecha enviada
       * @returns { Number }
       * @param { date } date fecha validada por ejemplo usando new Date()
       */
      getMinutes(date) {
        let minutes = dayjs(date).minute();
        minutes = minutes > 9 ? minutes : `0${minutes}`;
        return minutes;
      },
      /**
       * @author dbarra
       * @description Retorna los segundos de la fecha enviada
       * @returns { Number }
       * @param { date } date fecha validada por ejemplo usando new Date()
       */
      getSeconds(date) {
        let seconds = dayjs(date).second();
        seconds = seconds > 9 ? seconds : `0${seconds}`;
        return seconds;
      },
      /**
       * @author dbarra
       * @description Calcula la diferencia entre 2 fechas
       * @returns { milliseconds }
       * @param { startDate } startDate tiene que ser una fecha validada por ejemplo usando new Date()
       * @param { endDate } startDate tiene que ser una fecha validada por ejemplo usando new Date()
       */
      diff(endDate, startDate) {
        return dayjs(dayjs(endDate).format('YYYY-MM-DD')).diff(dayjs(startDate).format('YYYY-MM-DD'));
      }
    };

    Vue.prototype.$datetime = DatetimeService;
  }
};
