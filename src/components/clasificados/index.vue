<template>
  <v-card elevation="0">
    <crud-table
      v-if="showCrudTable"
      :headers="headers"
      :url.sync="url"
      :show-filter-options="false"
      :widthModal="500"
      :order="order"
      :show-filter-init="true"
      :filters.sync="filters"
      :custom="false"
      :filtro-as-query="false"
      :omitir-carga-on-mounted="true"
      >
    </crud-table>
  </v-card>
</template>
<script>
import axios from 'axios';
import CrudTable from '@/plugins/crud-table/CrudTable.vue';
import actions from '@/plugins/crud-table/mixins/crud-table';

export default {
  mixins: [actions],
  data: () => ({
    valid: false,
    showCrudTable: null,
    url: null,
    order: ['createdAt', 'DESC'],
    headers: [
      {
        text: 'RUDE',
        divider: false,
        sortable: false,
        align: 'center',
        value: 'rude'
      },
      {
        text: 'Distrito educativo',
        sortable: false,
        align: 'center',
        value: 'nombreDistrito'
      },
      {
        text: 'Unidad educativa',
        divider: false,
        sortable: false,
        align: 'center',
        value: 'nombreUnidadEducativa'
      },
    ],
    departamentos: [],
    unidadesEducativas: [],
    aOlimpiadas: [],
    aDepartamentos: [],
    aDistritos: [],
    aEtapas: [],
    aAreas: [],
    customizedFilters: [],
    departamentoSeleccionado: null,
    distritoSeleccionado: null,
    existOlimpiada: null,
    idEtapaSeleccionada: null,
    existUnidadEducativa: null,
    idOlimpiadaSeleccionada: null,
    idAreaSeleccionada: null,
    idUnidadesEducativaSeleccionada: null,
    aUnidadesEducativas: [],
    unidadEducativaSeleccionada: null,
    reference: null,
    filters: []
  }),
  mounted() {
    this.$nextTick(async () => {
      try {
        this.$vuetify.theme.dark = this.$storage.get('theme') || this.$vuetify.theme.dark;
        this.$storage.set('theme', this.$vuetify.theme.dark);
        await this.loadData();
        this.url = this.obtenerRuta();
        this.filters = this.definirFiltros();
        this.showCrudTable = true;
        setTimeout(() => {
          this.updateList();
        }, 100);
      } catch (error) {
        this.$message.error(error.message);
      }
    });
  },
  computed: {
    setDisabled () {
      let state = false;
      if (['DIRECTOR'].includes(this.$storage.get('rol').rol) && this.unidadEducativaSeleccionada) state = true;
      return state;
    }
  },
  methods: {
    obtenerRuta () {
      return `api/publicos/eag/${this.idAreaSeleccionada}/clasificados`;
    },
    async loadData () {
      try {
        await this.loadOlimpiadas();
        if (!this.$storage.get('olimpiadaSeleccionada')) {
          throw new Error('No tiene olimpiadas activas');
        }
        await this.loadEtapas();
        await this.loadAreas();
        await this.loadDepartamentos();
        await this.loadDistritos();
        await this.loadUnidadesEducativas();
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    async handleChangeEtapa(idEtapaSeleccionadaNueva) {
      if (idEtapaSeleccionadaNueva) {
        this.etapaSeleccionada = this.aEtapas.find(item => item.id === idEtapaSeleccionadaNueva);
        this.idEtapaSeleccionada = idEtapaSeleccionadaNueva;
        this.$storage.set('etapaSeleccionada', this.etapaSeleccionada);
        await this.loadAreas();
      } else {
        this.idEtapaSeleccionada = null;
        this.idAreaSeleccionada = null;
        this.aAreas = [];
        this.$storage.set('etapaSeleccionada', null);
        this.$storage.set('areaSeleccionada', null);
      }
      this.url = this.obtenerRuta();
      this.filters = this.definirFiltros();
    },
    async handleChangeArea(idAreaSeleccionadaNueva) {
      if (idAreaSeleccionadaNueva) {
        this.idAreaSeleccionada = idAreaSeleccionadaNueva;
        const areaSeleccionada = this.aAreas.find(item => item.id === this.idAreaSeleccionada);
        this.$storage.set('areaSeleccionada', areaSeleccionada);
      } else {
        this.idAreaSeleccionada = null;
        this.$storage.set('areaSeleccionada', null);
      }
      this.url = this.obtenerRuta();
      this.filters = this.definirFiltros();
    },
    searchInNiveles (idOlimpiada) {
      return new Promise((resolve, reject) => {
        try {
          const data = this.nivelUsuario.find(item => item.idOlimpiada === idOlimpiada);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
    },
    async handleChangeOlimpiada(idOlimpiadaSeleccionadaNueva) {
      this.olimpiadaSeleccionada = this.aOlimpiadas.find(item => item.id === idOlimpiadaSeleccionadaNueva);
      this.idOlimpiadaSeleccionada = idOlimpiadaSeleccionadaNueva;
      this.$storage.set('olimpiadaSeleccionada', this.olimpiadaSeleccionada);
      this.idAreaSeleccionada = null;
      this.idEtapaSeleccionada = null;
      this.aAreas = [];
      this.aEtapas = [];
      await this.loadEtapas();
      await this.loadAreas();
      this.url = this.obtenerRuta();
      this.filters = this.definirFiltros();
    },
    loadOlimpiadas() {
      return new Promise(async (resolve, reject) => {
        try {
          if (this.aOlimpiadas.length === 0) {
            const olimpiadas = await axios({
              method: 'GET',
              url: `${process.env.VUE_APP_BASE_URL}api/publicos/olimpiada?limite=50&pagina=1`
            });
            if (olimpiadas && olimpiadas.data) {
              this.aOlimpiadas = olimpiadas.data.datos.filas;
              this.idOlimpiadaSeleccionada = this.aOlimpiadas.length > 0 ? this.aOlimpiadas[0].id : null;
              this.$storage.set('olimpiadaSeleccionada', this.aOlimpiadas.length > 0 ? this.aOlimpiadas[0] : null);
            }
          }
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
    loadEtapas() {
      return new Promise(async (resolve, reject) => {
        try {
          const url = `${process.env.VUE_APP_BASE_URL}api/publicos/olimpiada/${this.idOlimpiadaSeleccionada}/etapas`;
          const etapas = await axios({ method: 'GET', url });
          if (etapas && etapas.data) {
            this.aEtapas = etapas.data.datos.filas;
            this.idEtapaSeleccionada = this.idEtapaSeleccionada ? this.idEtapaSeleccionada : this.aEtapas.length > 0 ? this.aEtapas[0].id : null;
            const etapaSeleccionada = this.aEtapas.find(item => item.id === this.idEtapaSeleccionada);
            this.$storage.set('etapaSeleccionada', etapaSeleccionada);
          }
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
    loadAreas() {
      return new Promise(async (resolve, reject) => {
        try {
          if (this.idEtapaSeleccionada) {
            const url = `${process.env.VUE_APP_BASE_URL}api/publicos/etapa/${this.idEtapaSeleccionada}/eag?limite=50&pagina=1`;
            const areas = await axios({ method: 'GET', url });
            if (areas && areas.data) {
              this.aAreas = areas.data.datos.filas;
              this.idAreaSeleccionada = this.idAreaSeleccionada ? this.idAreaSeleccionada : this.aAreas.length > 0 ? this.aAreas[0].id : null;
              const areaSeleccionada = this.aAreas.find(item => item.id === this.idAreaSeleccionada);
              this.$storage.set('areaSeleccionada', areaSeleccionada);
            }
          }
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
    loadDepartamentos() {
      return new Promise(async (resolve, reject) => {
        try {
          const url = `${process.env.VUE_APP_BASE_URL}api/publicos/departamento`;
          const departamentos = await axios({ method: 'GET', url });
          if (departamentos && departamentos.data) {
            this.aDepartamentos = departamentos.data.datos;
            this.idDepartamentoSeleccionado = this.idDepartamentoSeleccionado ? this.idDepartamentoSeleccionado : this.aDepartamentos.length > 0 ? this.aDepartamentos[0].id : null;
            const departamentoSeleccionado = this.aDepartamentos.find(item => item.id === this.idDepartamentoSeleccionado);
            this.$storage.set('departamentoSeleccionado', departamentoSeleccionado);
          }
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
    loadDistritos(str = null) {
      return new Promise(async (resolve, reject) => {
        try {
          if (this.idDepartamentoSeleccionado) {
            const searchName = str ? `nombre:${str},` : '';
            const url = `${process.env.VUE_APP_BASE_URL}api/publicos/distrito?filtro=${searchName}idDepartamento:${this.idDepartamentoSeleccionado}`;
            const distritos = await axios({ method: 'GET', url });
            if (distritos && distritos.data) {
              this.aDistritos = distritos.data.datos.filas;
              if (this.idDistritoSeleccionado) {
                this.idDistritoSeleccionado = this.idDistritoSeleccionado ? this.idDistritoSeleccionado : this.aDistritos.length > 0 ? this.aDistritos[0].id : null;
                const distritoSeleccionado = this.aDistritos.find(item => item.id === this.idDistritoSeleccionado);
                this.$storage.set('distritoSeleccionado', distritoSeleccionado);
              }
            }
          }
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
    loadUnidadesEducativas(str = null) {
      return new Promise(async (resolve, reject) => {
        try {
          const searchName = str ? `nombre:${str},` : '';
          const idDistrito = this.idDistritoSeleccionado ? `idDistrito:${this.idDistritoSeleccionado},` : '';
          const idDepartamento = `idDepartamento:${this.idDepartamentoSeleccionado}`;
          const url = `${process.env.VUE_APP_BASE_URL}api/publicos/unidadEducativa?filtro=${searchName}${idDistrito}${idDepartamento}`;
          const unidadesEducativas = await axios({ method: 'GET', url });
          if (unidadesEducativas && unidadesEducativas.data) {
            this.aUnidadesEducativas = unidadesEducativas.data.datos.filas;
            if (this.idUnidadesEducativaSeleccionada) {
              this.idUnidadesEducativaSeleccionada = this.aUnidadesEducativas.length > 0 ? this.aUnidadesEducativas[0].id : null;
              this.$storage.set('unidadEducativaSeleccionada', this.aUnidadesEducativas.length > 0 ? this.aUnidadesEducativas[0] : null);
            }
          }
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
    async handleChangeDep (idDepartamento) {
      this.idDepartamentoSeleccionado = idDepartamento;
      const departamentoSeleccionado = this.aDepartamentos.find(item => item.id === this.idDepartamentoSeleccionado);
      this.$storage.set('departamentoSeleccionado', departamentoSeleccionado);
      this.idDistritoSeleccionado = null;
      this.idUnidadesEducativaSeleccionada = null;
      await this.loadDistritos();
      await this.loadUnidadesEducativas();
      this.url = this.obtenerRuta();
      this.filters = this.definirFiltros();
    },
    async handleChangeDis (idDistrito) {
      this.idDistritoSeleccionado = idDistrito;
      const distritoSeleccionado = this.aDistritos.find(item => item.id === this.idDistritoSeleccionado);
      this.$storage.set('distritoSeleccionado', distritoSeleccionado);
      this.idUnidadesEducativaSeleccionada = null;
      this.aUnidadesEducativas = [];
      await this.loadUnidadesEducativas();
      this.url = this.obtenerRuta();
      this.filters = this.definirFiltros();
    },
    async searchDistritos (str) {
      await this.loadDistritos(str);
      this.filters = this.definirFiltros();
    },
    async searchUnidadesEducativas (str) {
      await this.loadUnidadesEducativas(str);
      this.filters = this.definirFiltros();
    },
    definirFiltros() {
      this.customizedFilters = [];
      this.customizedFilters.push({
        field: 'idOlimpiada',
        type: 'array',
        init: this.$storage.get('olimpiadaSeleccionada') ? this.$storage.get('olimpiadaSeleccionada').id : null,
        multiple: false,
        label: 'Olimpiadas',
        eventName: 'cambioOlimpiadas',
        onChange: this.handleChangeOlimpiada,
        values: this.aOlimpiadas.map(olimpiada => ({
          text: olimpiada.nombre,
          value: olimpiada.id
        })),
      });

      this.customizedFilters.push({
        field: 'idEtapa',
        type: 'array',
        init: this.idEtapaSeleccionada,
        multiple: false,
        label: 'Etapas',
        clear: false,
        eventName: 'cambioEtapas',
        onChange: this.handleChangeEtapa,
        values: this.aEtapas.map(etapa => ({
          text: etapa.nombre,
          value: etapa.id
        })),
      });

      this.customizedFilters.push({
        field: 'idArea',
        type: 'array',
        init: this.idAreaSeleccionada,
        multiple: false,
        label: 'Área - grados',
        clear: false,
        eventName: 'cambioAreas',
        onChange: this.handleChangeArea,
        values: this.aAreas.map(area => ({
          text: `${area.area.nombre} - ${area.gradoEscolar.nombre}`,
          value: area.id
        })),
      });

      this.customizedFilters.push({
        field: 'idDepartamento',
        type: 'array',
        multiple: false,
        clear: false,
        init: this.idDepartamentoSeleccionado,
        eventName: 'cambioDepartamento',
        onChange: this.handleChangeDep,
        label: 'Departamentos',
        values: this.aDepartamentos.map(departamento => ({
          text: departamento.nombre,
          value: departamento.id
        })),
      },
      {
        field: 'idDistrito',
        type: 'autocomplete',
        multiple: false,
        onChange: this.handleChangeDis,
        eventName: 'cambioDistritos',
        eventSearch: 'searchDistritos',
        onAutocomplete: this.searchDistritos,
        clear: true,
        init: this.idDistritoSeleccionado,
        label: 'Distritos',
        values: this.aDistritos.map(distrito => ({
          text: distrito.nombre,
          value: distrito.id
        })),
      });

      this.customizedFilters.push({
        field: 'idUnidadEducativa',
        type: 'autocomplete',
        init: this.idUnidadesEducativaSeleccionada,
        multiple: false,
        clear: true,
        eventSearch: 'searchUnidadesEducativas',
        onAutocomplete: this.searchUnidadesEducativas,
        label: 'Unidad educativa',
        values: this.aUnidadesEducativas.map(unidadEducativa => ({
          text: unidadEducativa.nombre,
          value: unidadEducativa.id
        })),
      });

      this.customizedFilters.push({
        field: 'rude',
        type: 'text',
        label: 'Rude'
      });

      return this.customizedFilters;
    },
    async activar(item) {
      const message = `¿Está seguro de activar ${item.nombre}?`;
      this.$confirm(
        message,
        async () => {
          const response = await this.$service.patch(`${this.url}/activacion/${item.id}`, {});
          if (response.isOK) {
            this.$message.success(response.mensaje);
          } else {
            this.$message.error(response.mensaje ?? response.message ?? `Error al activar ${item.nombre}`);
          }
          this.closeModal();
          this.updateList();
        }
      );
    },
    async inactivar(item) {
      const message = `¿Está seguro de inactivar ${item.nombre}?`;
      this.$confirm(
        message,
        async () => {
          try {
            const response = await this.$service.patch(`${this.url}/inactivacion/${item.id}`, {});
            this.$message.success(response.mensaje);
          } catch (error) {
            this.$message.error(error.mensaje ?? error.message ?? `Error al inactivar ${item.nombre}`);
          } finally {
            this.closeModal();
            this.updateList();
          }
        }
      );
    }
  },
  components: {
    CrudTable
  }
};
</script>
<style lang="scss">
</style>
