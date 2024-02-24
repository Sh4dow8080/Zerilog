import { ILogEventEnricher } from "../LoggerEnrichmentConfiguration";

export class NoOpEnricher implements ILogEventEnricher {
	enrich(): void {}
}
