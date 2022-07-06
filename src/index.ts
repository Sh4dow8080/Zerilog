import { ConsoleZink } from './ConsoleZink';
import { LoggerConfiguration } from './LoggerConfiguration';
import { LogLevel, LogMessageOptions, ZerilogConfiguration, ZerilogContext, ZerilogZink } from "./typings";

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
     * @param key Key for value or object to add to cobtext
     * @param value Value for key
     */
    public ForContext(key: string | object, value: any = null) {
        const newConfig = { ...this.config };
        if (key instanceof Object) {
            Object.entries(key)
                .forEach(
                    ([key, value]) => this._setContext(key, value)
                );
        } else
            this._setContext(key, value);
        return new Zerilog(newConfig);
    }

    public ForContextWhen(condition: () => boolean, key: string, value: any) {
        if (condition())
            return this.ForContext(key, value);

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

    public Information = (message: string, options?: LogMessageOptions) =>
        this.SendLog(LogLevel.Information, message, options);

    public Warning = (message: string, options?: LogMessageOptions) =>
        this.SendLog(LogLevel.Warning, message, options);

    public Error = (message: string, options?: LogMessageOptions) =>
        this.SendLog(LogLevel.Error, message, options);

    public Fatal = (message: string, options?: LogMessageOptions) =>
        this.SendLog(LogLevel.Fatal, message, options);

    public Debug = (message: string, options?: LogMessageOptions) =>
        this.SendLog(LogLevel.Debug, message, options);

    public Verbose = (message: string, options?: LogMessageOptions) =>
        this.SendLog(LogLevel.Verbose, message, options);

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

