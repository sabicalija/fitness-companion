import { defineStore } from "pinia";
import { useGoogleFitApi } from "@/composables/useGoogleFitApi";
import { compressToUTF16, decompressFromUTF16 } from "lz-string";

function saveToSessionStorage(key, data) {
  try {
    const compressedData = compressToUTF16(JSON.stringify(data));
    sessionStorage.setItem(key, compressedData);
  } catch (e) {
    if (e.name === "QuotaExceededError") {
      console.warn("Storage quota exceeded, dropping old data");
      // Drop the oldest data
      const keys = Object.keys(data);
      if (keys.length > 0) {
        delete data[keys[0]];
        // Retry saving after dropping old data
        const compressedData = compressToUTF16(JSON.stringify(data));
        sessionStorage.setItem(key, compressedData);
      }
    } else {
      throw e;
    }
  }
}

function loadFromSessionStorage(key) {
  const compressedData = sessionStorage.getItem(key);
  if (compressedData) {
    return JSON.parse(decompressFromUTF16(compressedData));
  }
  return null;
}

export const useFitnessStore = defineStore("fitness", {
  state: () => ({
    dataSources: loadFromSessionStorage("dataSources") || [],
    dataSets: loadFromSessionStorage("dataSets") || {},
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
        saveToSessionStorage("dataSources", this.dataSources);
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
        saveToSessionStorage("dataSets", this.dataSets);
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
