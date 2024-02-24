import { LoggerConfiguration } from "../src/LoggerConfiguration";
import { ConsoleZink } from "./../src/ConsoleZink";

import { LogLevel } from "../src";

describe("building zerilog config", () => {
	const config = new LoggerConfiguration()
		.WriteTo(new ConsoleZink())
		.MinimumLevel.Debug()
		.Enrich.WithProperty("test", "test")
		.Enrich.WithProperty("test2", "test2");

	it("should be able to build config", () => {
		const logger = config.CreateLogger();

		expect(logger).not.toBeNull();
	});

	it("should have minimum level of debug", () => {
		expect(config["_minimumLevel"]).toEqual(LogLevel.Debug);
	});

	it("should have property of test", () => {
		expect(config["_context"]).toHaveProperty("test");
	});

	it("should have property of test2", () => {
		expect(config["_context"]).toHaveProperty("test2");
	});
});
