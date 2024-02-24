import { LogEventProperty } from "../LogEventProperty";
import { LogEvent } from "../LogEvent";
import { ILogEventEnricher } from "../LoggerEnrichmentConfiguration";
export class FixedPropertyEnricher implements ILogEventEnricher {
	constructor(public readonly property: LogEventProperty) {}

	enrich(logEvent: LogEvent): void {
		logEvent.addPropertyIfAbsent(this.property);
	}
}
