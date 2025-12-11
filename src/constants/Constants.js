/** @format */

import envconfig from "../config/EnvConfig.js";

// Export standardized keys
export const openAIApiKey = envconfig.OPENAI_API_KEY;
export const supabaseUrl = envconfig.SUPABASE_URI;
export const supabaseKey = envconfig.SUPABASE_API_KEY;
export const mongoUri = envconfig.MONGO_URI;
export const port = envconfig.PORT;
export const hostname = envconfig.HOST_NAME;

// DO NOT log secrets to console. Log existence only for debugging.
console.log("OpenAI key present:", !!openAIApiKey);
console.log("Supabase URL present:", !!supabaseUrl);
