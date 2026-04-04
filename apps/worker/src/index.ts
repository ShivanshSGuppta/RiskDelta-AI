import dotenv from "dotenv";
import { resolve } from "path";
import { runtimeProcessor } from "./workers/runtime-processor";

dotenv.config({ path: resolve(process.cwd(), ".env") });
dotenv.config({ path: resolve(process.cwd(), "../../.env"), override: false });

runtimeProcessor.on("ready", () => {
  console.info("[worker] runtime-jobs processor ready");
});

runtimeProcessor.on("completed", (job) => {
  console.info(`[worker] job completed: ${job.id}`);
});

runtimeProcessor.on("failed", (job, error) => {
  console.error(`[worker] job failed: ${job?.id}`, error);
});
