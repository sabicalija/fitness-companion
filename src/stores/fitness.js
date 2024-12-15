import { defineStore } from "pinia";
import { useGoogleFitApi } from "@/composables/useGoogleFitApi";

export const useFitnessStore = defineStore("fitness", {
  state: () => ({
    dataSources: [],
    dataSet: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchDataSources() {
      this.loading = true;
      this.error = null;
      try {
        const { fetchDataSources } = useGoogleFitApi();
        const result = await fetchDataSources();
        this.dataSources = result.dataSource || [];
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchDataSet(dataStreamId, startTimeNanos, endTimeNanos) {
      this.loading = true;
      this.error = null;
      try {
        const { fetchDataSet } = useGoogleFitApi();
        const result = await fetchDataSet(dataStreamId, startTimeNanos, endTimeNanos);
        this.dataSet = result;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    getDataSourceByType: (state) => (type) => state.dataSources.filter((ds) => ds.dataType.name === type),
  },
});
