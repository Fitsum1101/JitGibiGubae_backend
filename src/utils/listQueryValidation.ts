import Joi from 'joi';

/** Query flag: `false` returns full list without pagination. Default `true`. */
export const listQueryHasPagination = Joi.alternatives()
  .try(Joi.boolean(), Joi.string().valid('true', 'false', '1', '0'))
  .default(true);

/** Optional boolean from query strings (e.g. `?allLanguage=true`). */
export const listQueryOptionalBoolean = Joi.alternatives()
  .try(Joi.boolean(), Joi.string().valid('true', 'false', '1', '0'))
  .optional();
