const config = {
    API_USERS_BASEURL: "http://localhost:5501", // direct url for debug
    API_SCRAPER_BASEURL: "http://localhost:5501", // direct url for debug

    API_TIMEOUT: 5000,  // Optional: API request timeout

    LOGIN_GOOGLE_URL: "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=abc&scope=openid%20profile%20email&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogingoogle&access_type=offline&nonce=", // Login URL Test

    GOOGLE_ANALYTICS_ID: "", // Google Analytics ID for tracking

    RECAPTCHA_SITE_KEY: ""
  };

  export default config;