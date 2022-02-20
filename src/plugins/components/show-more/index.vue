<template>
  <v-tooltip :content-class="className" bottom :color="color" :max-width="maxWidth">
    <template v-slot:activator="{ on, attrs }">
      <span
        :color="color"
        v-bind="attrs"
        v-on="on"
        class="ma-0 pa-0 fs9"
      >
        <template v-if="!image">
          Ver mas
        </template>
        <template v-else>
          <v-icon-component className="cursor--pointer primary--text" icon="image_search"></v-icon-component>
        </template>
      </span>
    </template>
    <span class="black--text" v-if="!image">
      {{ text }}
    </span>
    <v-img
      v-else
      :src="url"
      width="200"
      height="100"
    >
    </v-img>
  </v-tooltip>
</template>
<script>
import vIconComponent from '@/plugins/icon/index.vue';

const NAME = 'v-show-more';

export default {
  name: NAME,
  components: { vIconComponent },
  props: {
    color: {
      type: String,
      default: 'white'
    },
    text: {
      type: String,
    },
    image: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: null
    },
    maxWidth: {
      type: Number,
      default: 250
    },
    show: {
      type: Boolean,
      default: true
    }
  }
};
</script>
