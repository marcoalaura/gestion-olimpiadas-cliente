<template>
  <section class="snackbar__container">
    <v-snackbar
      :class="`snackbar--${$store.state.snackbar.theme}`"
      v-model="$store.state.snackbar.status"
      :timeout="$store.state.snackbar.timeout"
      :multi-line="false"
      top
      right
    >
      {{ $store.state.snackbar.message }}
      <template v-slot:action="{}">
        <v-btn icon @click.native.prevent="remove">
          <v-icon-component icon="close" class="white--text"></v-icon-component>
        </v-btn>
      </template>
    </v-snackbar>
  </section>
</template>

<script>
import vIconComponent from '@/plugins/icon/index.vue';

export default {
  components: {
    vIconComponent
  },
  methods: {
    remove() {
      this.$store.commit('setSnackbar', false);
    }
  },
  destroyed() {
    this.$store.commit('setSnackbar', false);
  }
};
</script>
<style lang="scss">
@import '../../scss/variables.scss';
.v-snack {
  padding-top: 20px !important;
}
.snackbar--icon {
  display: inline-flex;
  color: $white !important;
  i {
    padding-left: 10px;
    color: $white !important;
  }
}
.snackbar--success {
  .v-snack__wrapper {
    border-radius: 7px;
    background: $success !important;
    font-size: 0.8rem;
    max-width: 290px;
  }
}
.snackbar--info {
  .v-snack__wrapper {
    border-radius: 7px;
    background: $info !important;
    font-size: 0.8rem;
    max-width: 290px;
  }
}
.snackbar--error {
  .v-snack__wrapper {
    border-radius: 7px;
    background: $error !important;
    font-size: 0.8rem;
    max-width: 290px;
  }
}
.snackbar--warning {
  .v-snack__wrapper {
    border-radius: 7px;
    background: $warning !important;
    font-size: 0.8rem;
    max-width: 290px;
  }
}
</style>
