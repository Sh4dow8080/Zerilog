import { LogEventLevel } from "./LogEventLevel";
import { LogEventProperty } from "./LogEventProperty";
import { MessageTemplate } from "./MessageTemplate";

export type LogEventPropertyValue = any;

export class LogEvent {
	public constructor(
		public readonly timestamp: Date,
		public readonly level: LogEventLevel,
		public readonly exception: Error | null,
		public readonly messageTemplate: MessageTemplate,
		public readonly properties: Record<string, LogEventPropertyValue>
	) {}

	public addPropertyIfAbsent(property: LogEventProperty): void {
		const propertyName = property.name;
		const propertyValue = property.value;

		if (this.properties[propertyName] !== undefined) return;

		this.properties[propertyName] = propertyValue;
	}
}
