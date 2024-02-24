export class MessageTemplate {
	public text: string;
	public tokens: string[];

	public static get empty(): MessageTemplate {
		return new MessageTemplate("");
	}

	constructor(tokens: string[]);
	constructor(text: string, tokens?: string[]);
	constructor(text: string | string[], tokens: string[] = []) {
		this.text = text instanceof Array ? text.join("") : text;
		this.tokens = tokens || [];
	}
}
