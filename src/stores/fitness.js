import { defineStore } from "pinia";
import { useGoogleFitApi } from "@/composables/useGoogleFitApi";

export const useFitnessStore = defineStore("fitness", {
  state: () => ({
    dataSources: JSON.parse(sessionStorage.getItem("dataSources")) || [],
    dataSets: JSON.parse(sessionStorage.getItem("dataSets")) || {},
    loading: false,
    error: null,
  }),

  actions: {
    async fetchDataSources() {
      if (this.dataSources.length) {
        return this.dataSources;
      }

      this.loading = true;
      this.error = null;
      try {
        const { fetchDataSources } = useGoogleFitApi();
        const result = await fetchDataSources();
        this.dataSources = result.dataSource || [];
        sessionStorage.setItem("dataSources", JSON.stringify(this.dataSources));
        return this.dataSources;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchDataSet(dataStreamId, startTimeNanos, endTimeNanos, dataType) {
      if (this.dataSets[dataType]) {
        return this.dataSets[dataType];
      }

      this.loading = true;
      this.error = null;
      try {
        const { fetchDataSet } = useGoogleFitApi();
        const result = await fetchDataSet(dataStreamId, startTimeNanos, endTimeNanos);
        this.dataSets[dataType] = result;
        sessionStorage.setItem("dataSets", JSON.stringify(this.dataSets));
        return result;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    getDataSourceByType: (state) => (type) => state.dataSources.filter((ds) => ds.dataType.name === type),
    getDataSetByType: (state) => (type) => state.dataSets[type],
  },
});
