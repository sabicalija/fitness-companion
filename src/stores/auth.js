import { defineStore } from "pinia";

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
  },
});
