export class LogEventProperty {
	constructor(public readonly name: string, public readonly value: any) {
		this.assertValidName(name);
	}

	public static isValidName(name: string): boolean {
		return name != null && name.trim().length > 0;
	}

	private assertValidName(name: string): void {
		if (!LogEventProperty.isValidName(name)) {
			throw new Error("Property name must be a non-empty string.");
		}
	}
}
