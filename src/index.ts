import { ConsoleZink } from './ConsoleZink';
import { LoggerConfiguration } from './LoggerConfiguration';
import { LogLevel, LogMessageOptions, ZerilogConfiguration, ZerilogContext, ZerilogZink } from "./typings";

function format(message: string, ...params: any[]): string {
    return message.replace(/{(\d+)}/g, function (match, number) {
        return typeof params[number] != 'undefined'
            ? params[number]
            : match;
    });
};

export default class Zerilog {
    public static Logger: Zerilog | null;
    constructor(private config: ZerilogConfiguration) { }

    private _setContext(key: string, value: any, pos: number = 1): any {
        if (this.config.context.has(key) == false)
            return this.config.context.set(key, value);

        while (this.config.context.has(`${key}_${pos}`)) {
            pos++;
        }

        return this.config.context.set(`${key}_${pos}`, value);
    }

    /**
     * @param values Object with key/value pairs to be added to the context
     */
    public ForContext(values: object): Zerilog;
    /**
     * @param key Key to be added to the context
     * @param value Value for key to be added to the context
     */
    public ForContext(key: string, value: any): Zerilog;
    /**
     * @param key Key to be added to the context
     * @param value Value for key to be added to the context
     * @param parameters Parameters to for format string
     */
    public ForContext(key: string, value: string, ...parameters: string[]): Zerilog;
    public ForContext(key: string | object, value?: any, ...parameters: string[]): Zerilog {
        const newConfig = { ...this.config };
        if (key instanceof Object) {
            Object.entries(key)
                .forEach(
                    ([key, value]) => this._setContext(key, value)
                );
        } else {
            if (typeof value === "string" && parameters.length > 0)
                this._setContext(key, format(value, ...parameters));
            else
                this._setContext(key, value ?? "null");
        }

        return new Zerilog(newConfig);
    }

    public ForContextWhen(condition: boolean, key: object): Zerilog;
    public ForContextWhen(condition: () => boolean, key: object): Zerilog;

    public ForContextWhen(condition: boolean, key: string, value: any): Zerilog;
    public ForContextWhen(condition: () => boolean, key: string, value: any): Zerilog;

    public ForContextWhen(condition: boolean, key: string, value: string, ...parameters: string[]): Zerilog;
    public ForContextWhen(condition: () => boolean, key: string, value: string, ...parameters: string[]): Zerilog;

    public ForContextWhen(condition: (() => boolean) | boolean, key: string | object, value?: any, ...parameters: string[]): Zerilog {
        let shouldAddToContext = typeof condition === "function" ? condition() : condition;
        if (shouldAddToContext) {
            if (key instanceof Object)
                return this.ForContext(key);
            else
                return this.ForContext(key, value, ...parameters);
        }

        return this;
    }

    private SendLog(severity: LogLevel, message: string, options?: LogMessageOptions) {
        if (severity < this.config.minimumLevel) return;
        this.config.zinks.forEach(({ condition, zink: sink }) => {
            let ZeriContext = {
                logLevel: severity,
                message,
                properties: this.config.context,
                options
            };
            if (!condition(ZeriContext)) return;

            sink.SendLog(ZeriContext);
        });

        this.config.context.clear();
    }

    public Information(message: string): void;
    public Information(message: string, ...parameters: string[]): void;
    public Information(message: string, ...parameters: string[]): void {
        this.SendLog(LogLevel.Information, format(message, ...parameters));
    }

    public Warning(message: string): void;
    public Warning(message: string, ...parameters: string[]): void;
    public Warning(message: string, ...parameters: string[]) {
        this.SendLog(LogLevel.Warning, format(message, ...parameters));
    }

    public Error(message: string): void;
    public Error(message: string, ...parameters: string[]): void;
    public Error(message: string, ...parameters: string[]) {
        this.SendLog(LogLevel.Error, format(message, ...parameters));
    }

    public Fatal(message: string): void;
    public Fatal(message: string, ...parameters: string[]): void;
    public Fatal(message: string, ...parameters: string[]) {
        this.SendLog(LogLevel.Fatal, format(message, ...parameters));
    }

    public Debug(message: string): void;
    public Debug(message: string, ...parameters: string[]): void;
    public Debug(message: string, ...parameters: string[]) {
        this.SendLog(LogLevel.Debug, format(message, ...parameters));
    }

    public Verbose(message: string): void;
    public Verbose(message: string, ...parameters: string[]): void;
    public Verbose(message: string, ...parameters: string[]) {
        this.SendLog(LogLevel.Verbose, format(message, ...parameters));
    }

    toJSON() {
        return {
            minimumLevel: LogLevel[this.config.minimumLevel],
            context: this.config.context,
            zinks: this.config.zinks
        };
    }

}

export {
    LogLevel,
    LoggerConfiguration,
    ConsoleZink,
    ZerilogZink,
    ZerilogContext
};

