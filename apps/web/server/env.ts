import dotenv from "dotenv";
import { resolve } from "path";
import { loadWebEnv } from "@riskdelta/config";

dotenv.config({ path: resolve(process.cwd(), ".env") });
dotenv.config({ path: resolve(process.cwd(), "../../.env"), override: false });

export const env = loadWebEnv();
