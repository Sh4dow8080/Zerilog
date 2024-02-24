import { ILogEventEnricher } from "../LoggerEnrichmentConfiguration";

export class SafeAggregateEnricher implements ILogEventEnricher {
	constructor(private readonly _enrichers: ILogEventEnricher[]) {}
	enrich(logEvent: any): void {
		for (const enricher of this._enrichers) {
			try {
				enricher.enrich(logEvent);
			} catch (e) {
				console.error(
					`The enricher ${enricher} failed to enrich the log event: ${e}`
				);
			}
		}
	}
}
