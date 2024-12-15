export const fetchWithAuth = async (url, options = {}) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("User not authenticated.");
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "API request failed");
  }

  return response.json();
};
