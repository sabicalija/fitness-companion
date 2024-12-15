import { defineStore } from "pinia";

export const useFitnessStore = defineStore("fitness", {
  state: () => ({
    dataSources: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchDataSources() {
      this.loading = true;
      this.error = null;

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        this.error = "User not authenticated";
        this.loading = false;
        return;
      }

      try {
        const response = await fetch("https://www.googleapis.com/fitness/v1/users/me/dataSources", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch data sources");

        const result = await response.json();
        this.dataSources = result.dataSource || [];
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    filteredDataSources: (state) => (type) => state.dataSources.filter((ds) => ds.dataType.name === type),
  },
});
