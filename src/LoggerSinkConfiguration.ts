import { LoggerConfiguration } from "./LoggerConfiguration";
import { ILogEventSink } from "./LoggerEnrichmentConfiguration";

export class LoggerSinkConfiguration {
	constructor(
		private readonly _loggerConfiguration: LoggerConfiguration,
		private readonly _addSink: (sink: ILogEventSink) => void
	) {}

    public sink(sink: ILogEventSink): LoggerConfiguration {
        this._addSink(sink);
        return this._loggerConfiguration;
    }
}
