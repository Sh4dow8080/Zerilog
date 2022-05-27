import { ConsoleZink } from './ConsoleZink';
import { LoggerConfiguration } from './LoggerConfiguration';
import { LogLevel, LogMessageOptions, ZerilogConfiguration, ZerilogContext, ZerilogZink } from "./typings";

export default class Zerilog {
    public static Logger: Zerilog | null;
    constructor(private config: ZerilogConfiguration) { }

    public ForContext(key: string, value: any) {
        const newConfig = { ...this.config };
        newConfig.context.set(key, value);
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

