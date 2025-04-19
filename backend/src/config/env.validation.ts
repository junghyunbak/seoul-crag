import * as Joi from 'joi';

export type AppConfig = {
  NODE_ENV: 'development' | 'production';

  KAKAO_CLIENT_ID: string;
  KAKAO_REDIRECT_URI: string;

  DATABASE_URL: string;

  JWT_SECRET: string;
};

const NODE_ENVS: AppConfig['NODE_ENV'][] = ['development', 'production'];

export const envValidationSchema = Joi.object<AppConfig, true>({
  NODE_ENV: Joi.string()
    .valid(...NODE_ENVS)
    .required(),

  KAKAO_CLIENT_ID: Joi.string().required(),
  KAKAO_REDIRECT_URI: Joi.string().uri().required(),

  DATABASE_URL: Joi.string().uri().required(),

  JWT_SECRET: Joi.string().required(),
});
