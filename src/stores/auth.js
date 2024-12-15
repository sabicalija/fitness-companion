import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: null,
    isAuthenticated: false,
  }),
  actions: {
    login() {
      const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
      const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
      const SCOPES = [
        "https://www.googleapis.com/auth/fitness.activity.read",
        "https://www.googleapis.com/auth/fitness.blood_glucose.read",
        "https://www.googleapis.com/auth/fitness.blood_pressure.read",
        "https://www.googleapis.com/auth/fitness.body.read",
        "https://www.googleapis.com/auth/fitness.heart_rate.read",
        "https://www.googleapis.com/auth/fitness.body_temperature.read",
        "https://www.googleapis.com/auth/fitness.location.read",
        "https://www.googleapis.com/auth/fitness.nutrition.read",
        "https://www.googleapis.com/auth/fitness.oxygen_saturation.read",
        "https://www.googleapis.com/auth/fitness.reproductive_health.read",
        "https://www.googleapis.com/auth/fitness.sleep.read",
      ];
      const oauthUrl = [
        "https://accounts.google.com/o/oauth2/v2/auth?",
        `client_id=${CLIENT_ID}&`,
        `redirect_uri=${REDIRECT_URI}&`,
        "response_type=code&",
        `scope=${encodeURIComponent(SCOPES.join(" "))}`,
      ].join("");
      window.location.href = oauthUrl;
    },
    async fetchAccessToken(authCode) {
      const router = useRouter();

      try {
        const response = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            code: authCode,
            client_id: import.meta.env.VITE_CLIENT_ID,
            client_secret: import.meta.env.VITE_CLIENT_SECRET,
            redirect_uri: import.meta.env.VITE_REDIRECT_URI,
            grant_type: "authorization_code",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response from Google:", errorData);
          return;
        }

        const data = await response.json();

        if (data.access_token) {
          this.accessToken = data.access_token;
          this.isAuthenticated = true;
          localStorage.setItem("accessToken", data.access_token);
          router.replace({ name: "Dashboard" });
        }
      } catch (error) {
        console.error("Error exchanging code for token:", error);
      }
    },
    logout() {
      this.accessToken = null;
      this.isAuthenticated = false;
      localStorage.removeItem("accessToken");
    },
  },
});
