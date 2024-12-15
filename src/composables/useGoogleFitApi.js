import { fetchWithAuth } from "@/utils/api";

export function useGoogleFitApi(token) {
  const fetchDataSources = async () => {
    const url = "https://www.googleapis.com/fitness/v1/users/me/dataSources";
    return await fetchWithAuth(url);
  };
  const fetchDataSet = async (dataStreamId, startTimeNanos, endTimeNanos) => {
    const url = `https://www.googleapis.com/fitness/v1/users/me/dataSources/${dataStreamId}/datasets/${startTimeNanos}-${endTimeNanos}`;
    return await fetchWithAuth(url);
  };

  return {
    fetchDataSources,
    fetchDataSet,
  };
}
