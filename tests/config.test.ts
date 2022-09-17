import { LoggerConfiguration } from '../src/LoggerConfiguration';
import { ConsoleZink } from './../src/ConsoleZink';

import * as chai from 'chai';
import { LogLevel } from '../src';

describe("building zerilog config", () => {
    const config = new LoggerConfiguration()
        .WriteTo(new ConsoleZink())
        .MinimumLevel.Debug()
        .Enrich.WithProperty("test", "test")
        .Enrich.WithProperty("test2", "test2");

    it("should be able to build config", () => {
        const logger = config.CreateLogger();

        chai.expect(logger)
            .to
            .not
            .be
            .null;
    });

    it("should have minimum level of debug", () => {
        chai.expect(config["_minimumLevel"])
            .to
            .equal(LogLevel.Debug);
    });

    it("should have property of test", () => {
        chai.expect(config["_context"])
            .to
            .have
            .any
            .keys("test");
    });

    it("should have property of test2", () => {
        chai.expect(config["_context"])
            .to
            .have
            .any
            .keys("test2");
    });
});