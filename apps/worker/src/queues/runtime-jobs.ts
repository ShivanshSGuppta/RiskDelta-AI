import dotenv from "dotenv";
import { resolve } from "path";
import { Queue } from "bullmq";
import { loadWorkerEnv } from "@riskdelta/config";

dotenv.config({ path: resolve(process.cwd(), ".env") });
dotenv.config({ path: resolve(process.cwd(), "../../.env"), override: false });

const env = loadWorkerEnv();

export const runtimeJobQueue = new Queue("runtime-jobs", {
  connection: {
    host: new URL(env.REDIS_URL).hostname,
    port: Number(new URL(env.REDIS_URL).port || 6379),
    password: new URL(env.REDIS_URL).password || undefined,
  },
});
