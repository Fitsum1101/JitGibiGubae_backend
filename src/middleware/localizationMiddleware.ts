import i18next from 'i18next';
import * as middleware from 'i18next-http-middleware';
import ICU from 'i18next-icu';

import { locales } from '../locales/index';

i18next
  .use(ICU)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'am'],
    preload: ['en', 'am'],

    resources: {
      en: {
        translation: locales.en,
      },
      am: {
        translation: locales.am,
      },
    },

    detection: {
      order: ['querystring', 'header'],
      lookupQuerystring: 'lng',
      caches: false,
    },

    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
  })
  .catch((error: Error) => {
    console.error('Failed to initialize i18next:', error);
    process.exit(1);
  });

export const i18nMiddleware = middleware.handle(i18next);
export const t = i18next.t.bind(i18next);

export default {
  i18nMiddleware,
  i18next,
  t,
};
