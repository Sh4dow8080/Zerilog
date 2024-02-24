import { LogEvent } from "./LogEvent";
import { LoggerConfiguration } from "./LoggerConfiguration";
import { ILogEventSink } from "./LoggerEnrichmentConfiguration";

class MockSink implements ILogEventSink {
	emit(logEvent: LogEvent): void {
		console.log("Hello From MockSink", logEvent);
	}
}

const logger = new LoggerConfiguration().minimumLevel
	.verbose()
	.enrich.with({ enrich: () => {} })
	.enrich.with([{ enrich: () => {} }])
	.writeTo.sink(new MockSink())
	.createLogger();

logger.debug("Hello, world!");
