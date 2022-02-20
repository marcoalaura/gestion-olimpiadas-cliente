<template>
  <v-card color="backgroundColor" elevation="0" class="app-reportes d-flex flex-column align-center justify-center">
    <div class="header">
      <v-img
        max-width="700px"
        contain
        :src="this.$vuetify.theme.dark ? './img/header-logo-minedu-dark.png' : './img/header-logo-minedu.png'"
      />
    </div>
    <v-card elevation="0" color="backgroundColor" class="titulo-home">
      Sección de reportes
    </v-card>
  </v-card>
</template>
<script>
import Auth from '../auth/mixins/auth';

export default {
  mixins: [Auth],
  mounted() {
    this.$nextTick(() => {
      this.logout();
    });
  }
};
</script>

<style lang="scss">
@import '../../scss/variables.scss';

.titulo-home {
  font-size: 2rem;
  padding-top: 30px;
  color: $primary !important;
  letter-spacing: 0;
  user-select: none;
  text-align: center;
}

.app-reportes {
  max-width: 700px;
  margin: auto;
  height: 200px;
  width: 100%;
  .header {
    background-size: contain;
    width: 100%;
    height: 200px;
  }
}

</style>
