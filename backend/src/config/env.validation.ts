import * as Joi from 'joi';

const NODE_ENVS = ['dev', 'prod', 'test'] as const;

type NODE_ENV = (typeof NODE_ENVS)[number];

export type AppConfig = {
  NODE_ENV: NODE_ENV;

  KAKAO_CLIENT_ID: string;
  KAKAO_REDIRECT_URI: string;

  KAKAO_REST_API_KEY: string;

  DATABASE_URL: string;

  JWT_SECRET: string;
};

export const envValidationSchema = Joi.object<AppConfig, true>({
  NODE_ENV: Joi.string()
    .valid(...NODE_ENVS)
    .required(),

  KAKAO_CLIENT_ID: Joi.string().required(),
  KAKAO_REDIRECT_URI: Joi.string().uri().required(),

  KAKAO_REST_API_KEY: Joi.string().required(),

  DATABASE_URL: Joi.string().uri().required(),

  JWT_SECRET: Joi.string().required(),
});
