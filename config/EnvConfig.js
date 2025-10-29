/** @format */
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const EnvConfig = {
  OPENAI_API: process.env.OPENAI_API_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_API_KEY,
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT,
  HOST_NAME: process.env.HOST_NAME,
};

export default EnvConfig;
