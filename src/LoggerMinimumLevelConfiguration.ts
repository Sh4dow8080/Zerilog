import { LogEventLevel } from "./LogEventLevel";
import { LoggerConfiguration } from "./LoggerConfiguration";

export class LoggerMinimumLevelConfiguration {
	constructor(
		private readonly _loggerConfiguration: LoggerConfiguration,
		private readonly _setMinimumLevel: (level: LogEventLevel) => void
	) {}

	private is(level: LogEventLevel) {
		this._setMinimumLevel(level);
		return this._loggerConfiguration;
	}

	public verbose = () => this.is(LogEventLevel["Verbose"]);
	public debug = () => this.is(LogEventLevel["Debug"]);
	public information = () => this.is(LogEventLevel["Information"]);
	public warning = () => this.is(LogEventLevel["Warning"]);
	public error = () => this.is(LogEventLevel["Error"]);
	public fatal = () => this.is(LogEventLevel["Fatal"]);
}
