declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FRONTEND_URL_CORS?: string;
      LOGGER_LEVEL?: string;
      COOKIE_SECRET?: string;
      ACCESS_TOKEN_SECRET?: string;
      /** Alias for `JWT_REFRESH_SECRET` in some deployments. */
      REFRESH_TOKEN_SECRET?: string;
      PORT?: string;
      DATABASE_URL?: string;
      EMAIL_FROM?: string;
      EMAIL_USER?: string;
      EMAIL_PORT?: string;
      EMAIL_SERVICE?: string;
      EMAIL_PASS?: string;
      EMAIL_HOST?: string;
      SUPPORT_EMAIL?: string;
      FRONTEND_URL?: string;
      JWT_EXPIRES_IN?: string;
      JWT_AUDIENCE?: string;
      JWT_ISSUER?: string;
      JWT_SECRET?: string;
      OBS_ACCESS_KEY?: string;
      OBS_SECRET_KEY?: string;
      OBS_ENDPOINT?: string;
      OBS_BUCKET_NAME?: string;
      STORAGE_TYPE?: string;
      UPLOAD_DEST?: string;
      MAX_IMAGE_SIZE?: string;
      MAX_DOCUMENT_SIZE?: string;
      MAX_VIDEO_SIZE?: string;
      MAX_AUDIO_SIZE?: string;
      REDIS_HOST?: string;
      REDIS_PORT?: string;
      REDIS_USERNAME?: string;
      REDIS_PASSWORD?: string;
      JWT_REFRESH_SECRET?: string;
      JWT_REFRESH_EXPIRES_IN?: string;
      /** Redis-backed GET response cache TTL in seconds (see `cacheMiddleware`). */
      CACHE_TTL_SECONDS?: string;
      AFROMESSAGE_API_KEY?: string;
      AFROMESSAGE_BASE_URL?: string;
      /** When `NODE_ENV=production`, set to `true` to expose `/api/v1/send-sms`, `/send-bulk-sms`, `/test-email`. */
      ALLOW_TEST_MESSAGING_ROUTES?: string;
      FRONTEND_URL_CLIENT?: string;
      FRONTEND_URL_ADMIN?: string;
    }
  }
}

export {};
