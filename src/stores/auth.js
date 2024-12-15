import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: null,
  }),
  actions: {
    login() {
      const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
      const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/fitness.body.read`;
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
          this.accessToken = data.access_token; // Update store state
          localStorage.setItem("accessToken", data.access_token); // Persist token
          router.replace({ name: "Dashboard" }); // Navigate to dashboard
        }
      } catch (error) {
        console.error("Error exchanging code for token:", error);
      }
    },
    logout() {
      this.accessToken = null;
      localStorage.removeItem("accessToken");
    },
  },
});
