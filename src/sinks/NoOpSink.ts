import { ILogEventSink } from "../LoggerEnrichmentConfiguration";

export class NoOpSink implements ILogEventSink {
	public emit(): void {
		// Do nothing
	}
}
