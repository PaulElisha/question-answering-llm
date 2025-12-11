/** @format */
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const getEnvConfig = () => {
  const getEnv = (key) => {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
  };

  return {
    OPENAI_API_KEY: getEnv("OPENAI_API_KEY"),
    SUPABASE_URI: getEnv("SUPABASE_URI"),
    SUPABASE_API_KEY: getEnv("SUPABASE_API_KEY"),
    MONGO_URI: getEnv("MONGO_URI"),
    PORT: getEnv("PORT"),
    HOST_NAME: getEnv("HOST_NAME"),
  };
};

const envconfig = getEnvConfig();

export default envconfig;
