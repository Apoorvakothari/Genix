const dotenv = require("dotenv");
const Joi = require("joi");

dotenv.config({});

const environmentSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().positive().required(),
    BASE_URL: Joi.string().required().description("Base URL of the API"),
    API_SECRET: Joi.string().required().description("API secret key"),
    MONGO_URI: Joi.string().required().description("Mongo DB url"),
  })
  .unknown();

const { value: env, error } = environmentSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: env.NODE_ENV,
  base: {
    url: env.BASE_URL,
  },
  port: env.PORT,
  mongoose: {
    url: env.MONGO_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // autoIndex: false,
      // poolSize: 10,
      // serverSelectionTimeoutMS: 5000,
      // socketTimeoutMS: 45000,
      // family: 4, // IPv4
    },
  },
  api: {
    secret: env.API_SECRET,
  },
};
