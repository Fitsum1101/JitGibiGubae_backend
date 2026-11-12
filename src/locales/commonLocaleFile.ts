/** Shape of `src/locales/common/{en,am}.json` for merging into i18n resources. */
export type CommonLocaleFile = {
  common?: {
    errors?: Record<string, string>;
    validation?: Record<string, string>;
  };
  validation?: { failed?: string };
};
