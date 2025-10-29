/** @format */

import EnvConfig from "../config/EnvConfig.js";

// Export standardized keys
export const openAIApiKey = EnvConfig.OPENAI_API;
export const supabaseUrl = EnvConfig.SUPABASE_URL;
export const supabaseKey = EnvConfig.SUPABASE_KEY;
export const mongoUri = EnvConfig.MONGO_URI;
export const port = EnvConfig.PORT;
export const hostname = EnvConfig.HOST_NAME;

// DO NOT log secrets to console. Log existence only for debugging.
console.log("OpenAI key present:", !!openAIApiKey);
console.log("Supabase URL present:", !!supabaseUrl);
