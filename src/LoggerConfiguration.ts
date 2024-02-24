import { LogEventLevel } from "./LogEventLevel";
import { Logger } from "./Logger";
import {
	ILogEventEnricher,
	ILogEventSink,
	LoggerEnrichmentConfiguration,
} from "./LoggerEnrichmentConfiguration";
import { LoggerMinimumLevelConfiguration } from "./LoggerMinimumLevelConfiguration";
import { LoggerSinkConfiguration } from "./LoggerSinkConfiguration";
import { NoOpEnricher } from "./enrichers/NoOpEnricher";
import { SafeAggregateEnricher } from "./enrichers/SafeAggregateEnricher";
import { NoOpSink } from "./sinks/NoOpSink";
import { SafeAggregateSink } from "./sinks/SafeAggregateSink";

export class LoggerConfiguration {
	private _loggerCreated = false;
	private _minimumLevel: LogEventLevel = LogEventLevel.Information;
	private _enrichers: ILogEventEnricher[] = [];
	private _sinks: ILogEventSink[] = [];

	public minimumLevel = new LoggerMinimumLevelConfiguration(this, (level) => {
		this._minimumLevel = level;
	});

	public enrich = new LoggerEnrichmentConfiguration(this, (enricher) => {
		this._enrichers.push(enricher);
	});

	public writeTo = new LoggerSinkConfiguration(this, (sink) => {
		this._sinks.push(sink);
	});

	public createLogger(): Logger {
		this.assertLoggerNotCreated();

		let sink = this.resolveSink();
		let enricher = this.resolveEnricher();

		return new Logger(this._minimumLevel, enricher, sink);
	}

	private resolveEnricher(): ILogEventEnricher {
		if (this._enrichers.length === 0) {
			return new NoOpEnricher();
		}

		return new SafeAggregateEnricher(this._enrichers);
	}

	private resolveSink(): ILogEventSink {
		if (this._sinks.length === 0) {
			return new NoOpSink();
		}

		return new SafeAggregateSink(this._sinks);
	}

	private assertLoggerNotCreated() {
		if (this._loggerCreated) {
			throw new Error("Logger has already been created");
		}

		this._loggerCreated = true;
	}
}
