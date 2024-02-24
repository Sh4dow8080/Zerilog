import { LogEvent } from "./LogEvent";
import { LogEventProperty } from "./LogEventProperty";
import { LoggerConfiguration } from "./LoggerConfiguration";
import { FixedPropertyEnricher } from "./enrichers/FixedPropertyEnricher";

export interface ILogEventEnricher {
	enrich(logEvent: LogEvent): void;
}

export interface ILogEventSink {
	emit(logEvent: LogEvent): void;
}

export class LoggerEnrichmentConfiguration {
	constructor(
		private readonly _loggerConfiguration: LoggerConfiguration,
		private readonly _addEnricher: (enricher: ILogEventEnricher) => void
	) {}

	public with(enricher: ILogEventEnricher): LoggerConfiguration;
	public with(enricher: ILogEventEnricher[]): LoggerConfiguration;
	public with(enricher: ILogEventEnricher | ILogEventEnricher[]) {
		const _enrichers = Array.isArray(enricher) ? enricher : [enricher];

		for (const _enricher of _enrichers) {
			this._addEnricher(_enricher);
		}

		return this._loggerConfiguration;
	}

	public withProperty(name: string, value: any): LoggerConfiguration {
		return this.with(
			new FixedPropertyEnricher(new LogEventProperty(name, value))
		);
	}
}
