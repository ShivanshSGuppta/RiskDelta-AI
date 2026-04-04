import { IngestTraceRequestSchema, type IngestTraceRequest } from "@riskdelta/types";

export type RiskDeltaClientOptions = {
  apiBaseUrl: string;
  apiKey: string;
};

export class RiskDeltaClient {
  constructor(private readonly options: RiskDeltaClientOptions) {}

  async ingestTrace(input: IngestTraceRequest) {
    const payload = IngestTraceRequestSchema.parse(input);
    const response = await fetch(`${this.options.apiBaseUrl}/v1/ingest/traces`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.options.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Ingestion failed (${response.status}): ${text}`);
    }

    return response.json();
  }
}

export function createRiskDeltaClient(options: RiskDeltaClientOptions) {
  return new RiskDeltaClient(options);
}
