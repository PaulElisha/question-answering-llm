/** @format */
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

// Standardized environment variables used across the project:
// OPENAI_API  - OpenAI API key
// SUPABASE_URL - Supabase project URL
// SUPABASE_KEY - Supabase service role or anon key

const EnvConfig = {
  OPENAI_API: process.env.OPEN_AI_API_KEY,
  SUPABASE_URL: process.env.SUPA_BASE_URL,
  SUPABASE_KEY: process.env.SUPA_BASE_API_KEY,
};

export default EnvConfig;
