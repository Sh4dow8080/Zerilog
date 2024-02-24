import { ILogEventSink } from "../LoggerEnrichmentConfiguration";

export class SafeAggregateSink implements ILogEventSink {
	constructor(private readonly _sinks: ILogEventSink[]) {}
	public emit(logEvent: any): void {
		for (const sink of this._sinks) {
			try {
				sink.emit(logEvent);
			} catch (e) {
				console.error(
					`The sink ${sink} failed to emit the log event: ${e}`
				);
			}
		}
	}
}
