import { LogEvent } from "../src/LogEvent";
import { Logger } from "../src/Logger";
import { LoggerConfiguration } from "../src/LoggerConfiguration";
import { ILogEventSink } from "../src/LoggerEnrichmentConfiguration";

const mockLog = jest.fn<any, [LogEvent], any>();
class MockSink implements ILogEventSink {
	emit(logEvent: LogEvent): void {
		mockLog(logEvent);
	}
}

function createBaseLoggerConfiguration() {
	// prettier-ignore
	return new LoggerConfiguration()
		.writeTo.sink(new MockSink());
}

describe("abe", () => {
	let logger = createBaseLoggerConfiguration().createLogger();
	beforeEach(() => {
		logger = createBaseLoggerConfiguration().createLogger();
		mockLog.mockClear();
	});

	it("should be defined and of type Logger", () => {
		// Arrange, Act, Assert
		expect(logger).toBeInstanceOf(Logger);
	});

	it("should log a message", () => {
		// Arrange, Act
		logger.information("Hello, world!");

		// Assert
		expect(mockLog).toHaveBeenCalled();
	});

	it("should log a message with a property", () => {
		// Arrange
		const logger2 = createBaseLoggerConfiguration()
			.enrich.withProperty("test", "test")
			.minimumLevel.verbose()
			.createLogger();

		// Act
		logger2.debug("Hello, world!");

		// Assert
		const logEvent = mockLog.mock.lastCall?.[0];
		expect(logEvent?.properties).toHaveProperty("test", "test");
	});

	it("should log a message with a property using forContext", () => {
		// Arrange
		const logger2 = createBaseLoggerConfiguration()
			.minimumLevel.verbose()
			.createLogger();

		// Act
		logger2.forContext("test", "test").debug("Hello, world!");

		// Assert
		const logEvent = mockLog.mock.lastCall?.[0];
		expect(logEvent?.properties).toHaveProperty("test", "test");
	});

	it("should log a message with an error", () => {
		// Arrange
		const error = new Error("Test error");

		// Act
		logger.error(error, "Hello, world!");

		// Assert
		const logEvent = mockLog.mock.lastCall?.[0];
		expect(logEvent?.exception).toBe(error);
	});

	it("should log a message with an error and a bound property", () => {
		// Arrange
		const error = new Error("Test error");

		// Act
		logger.error(error, "Hello, {Name}", "World!");

		// Assert
		const logEvent = mockLog.mock.lastCall?.[0];

		console.log(logEvent)
		expect(logEvent?.exception).toBe(error);
		expect(logEvent?.properties).toHaveProperty("Name", "World!");
	});

	it("should log a message with an error and a property using forContext", () => {
		// Arrange
		const error = new Error("Test error");

		// Act
		logger.forContext("test", "test").error(error, "Hello, world!");

		// Assert
		const logEvent = mockLog.mock.lastCall?.[0];
		expect(logEvent?.exception).toBe(error);
		expect(logEvent?.properties).toHaveProperty("test", "test");
	});
});
