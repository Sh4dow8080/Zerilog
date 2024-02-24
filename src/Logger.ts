import { LogEvent, LogEventPropertyValue } from "./LogEvent";
import { LogEventLevel } from "./LogEventLevel";
import { LogEventProperty } from "./LogEventProperty";
import {
	ILogEventEnricher,
	ILogEventSink,
} from "./LoggerEnrichmentConfiguration";
import { MessageTemplate } from "./MessageTemplate";
import { FixedPropertyEnricher } from "./enrichers/FixedPropertyEnricher";

interface ILoggerMethod {
	(messageTemplate: string, ...properties: any[]): void;
	(exception: Error, messageTemplate: string, ...properties: any[]): void;
}

export class Logger implements ILogEventSink {
	constructor(
		private readonly minimumLevel: LogEventLevel,
		private readonly enricher: ILogEventEnricher,
		private readonly sink: ILogEventSink
	) {}

	public emit(logEvent: LogEvent): void {
		this.dispatch(logEvent);
	}

	public forContext(propertyEnricher: ILogEventEnricher): Logger;
	public forContext(propertyName: string, value: any): Logger;
	public forContext(
		propertyNameOrEnricher: string | ILogEventEnricher,
		value?: any
	): Logger {
		if (propertyNameOrEnricher instanceof LogEventProperty) {
			return new Logger(
				this.minimumLevel,
				new FixedPropertyEnricher(propertyNameOrEnricher),
				this
			);
		} else if (typeof propertyNameOrEnricher === "string") {
			if (!LogEventProperty.isValidName(propertyNameOrEnricher)) {
				console.error(
					`The property name "${propertyNameOrEnricher}" is not valid.`
				);

				return this;
			}

			const enricher = new FixedPropertyEnricher(
				new LogEventProperty(propertyNameOrEnricher, value)
			);

			return new Logger(this.minimumLevel, enricher, this);
		}

		return this;
	}

	public debug: ILoggerMethod = this.createWriteMethod(LogEventLevel.Debug);
	public information: ILoggerMethod = this.createWriteMethod(
		LogEventLevel.Information
	);
	public warning: ILoggerMethod = this.createWriteMethod(
		LogEventLevel.Warning
	);
	public error: ILoggerMethod = this.createWriteMethod(LogEventLevel.Error);
	public fatal: ILoggerMethod = this.createWriteMethod(LogEventLevel.Fatal);

	private createWriteMethod(level: LogEventLevel): ILoggerMethod {
		return (
			messageTemplateOrError: string | Error,
			...remainingArgs: any[]
		) => {
			if (messageTemplateOrError instanceof Error) {
				const exception = messageTemplateOrError;
				const messageTemplate = remainingArgs[0];
				const properties = remainingArgs.slice(1);

				return this.write(
					level,
					messageTemplate,
					properties,
					exception
				);
			} else if (typeof messageTemplateOrError === "string") {
				const messageTemplate = messageTemplateOrError;
				const properties = remainingArgs;

				return this.write(level, messageTemplate, properties, null);
			}
			throw new Error("Invalid arguments");
		};
	}

	private write(
		level: LogEventLevel,
		messageTemplate: string,
		properties: Array<LogEventPropertyValue>,
		exception: Error | null
	): void {
		if (!this.isLogLevelEnabled(level)) return;

		const timestamp = new Date();

		// TODO: Implement message template parsing
		const parsedMessageTemplate = new MessageTemplate(messageTemplate);
		const boundProperties = {};

		const logEvent = new LogEvent(
			timestamp,
			level,
			exception,
			parsedMessageTemplate,
			boundProperties
		);

		this.dispatch(logEvent);
	}

	private isLogLevelEnabled(level: LogEventLevel): boolean {
		return level >= this.minimumLevel;
	}

	private dispatch(logEvent: LogEvent): void {
		try {
			this.enricher.enrich(logEvent);
		} catch (error) {
			console.error(
				`The enricher ${this.enricher} failed to enrich the log event: ${error}`
			);
		}

		this.sink.emit(logEvent);
	}
}
