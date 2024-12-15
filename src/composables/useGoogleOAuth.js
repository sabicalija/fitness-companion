export function useGoogleOAuth(clientId) {
  const authEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
  const tokenEndpoint = "https://oauth2.googleapis.com/token";

  const getAuthUrl = (redirectUri, scope) => {
    return [
      `${authEndpoint}?client_id=${clientId}`,
      `redirect_uri=${redirectUri}`,
      "response_type=code",
      `scope=${encodeURIComponent(scope.join(" "))}`,
    ].join("&");
  };

  const exchangeCodeForToken = async (code, clientId, clientSecret, redirectUri) => {
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    return response.json();
  };

  return {
    getAuthUrl,
    exchangeCodeForToken,
  };
}
