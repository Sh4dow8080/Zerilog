import Zerilog from ".";
import { LogLevel, ZerilogZink, ZinkWithCondition, ZinkWithConditionMethod } from "./typings";



export class LoggerConfiguration {
    private _minimumLevel: LogLevel = LogLevel.Debug;
    private _context: Map<string, any> = new Map();
    private _zinks: ZinkWithCondition[] = [];

    constructor() {
        this.Enrich.WithProperty = this.Enrich.WithProperty.bind(this);
        this.Enrich.When = this.Enrich.When.bind(this);
        this.Enrich.AtLevel = this.Enrich.AtLevel.bind(this);

        this.MinimumLevel.Debug = this.MinimumLevel.Debug.bind(this);
        this.MinimumLevel.Verbose = this.MinimumLevel.Verbose.bind(this);
        this.MinimumLevel.Information = this.MinimumLevel.Information.bind(this);
        this.MinimumLevel.Warning = this.MinimumLevel.Warning.bind(this);
        this.MinimumLevel.Error = this.MinimumLevel.Error.bind(this);
        this.MinimumLevel.Fatal = this.MinimumLevel.Fatal.bind(this);
    }

    public WriteTo(zink: ZerilogZink) {
        this._zinks.push({
            zink: zink,
            condition: () => true
        });
        return this;
    }

    public WriteToWhen(condition: ZinkWithConditionMethod, zink: ZerilogZink) {
        this._zinks.push({
            zink: zink,
            condition
        });
        return this;
    }

    public MinimumLevel: {
        Debug: () => LoggerConfiguration;
        Verbose: () => LoggerConfiguration;
        Information: () => LoggerConfiguration;
        Warning: () => LoggerConfiguration;
        Error: () => LoggerConfiguration;
        Fatal: () => LoggerConfiguration;
    } = {
            Debug: () => { this._minimumLevel = LogLevel.Debug; return this; },
            Verbose: () => { this._minimumLevel = LogLevel.Verbose; return this; },
            Information: () => { this._minimumLevel = LogLevel.Information; return this; },
            Warning: () => { this._minimumLevel = LogLevel.Warning; return this; },
            Error: () => { this._minimumLevel = LogLevel.Error; return this; },
            Fatal: () => { this._minimumLevel = LogLevel.Fatal; return this; }
        };

    public Enrich: {
        WithProperty: (key: string, value: any) => LoggerConfiguration;
        When: (ondition: () => boolean, key: string, value: string) => LoggerConfiguration;
        AtLevel: (level: LogLevel, key: string, value: string) => LoggerConfiguration;
    } = {
            WithProperty: (key: string, value: string): LoggerConfiguration => {
                if (this._context.has(key))
                    throw new Error(`Property ${key} already exists`);

                this._context.set(key, value);
                return this;
            },

            When: (condition: () => boolean, key: string, value: string): LoggerConfiguration => {
                if (condition())
                    this.Enrich.WithProperty(key, value);
                return this;
            },

            AtLevel: (level: LogLevel, key: string, value: string): LoggerConfiguration => {
                if (level === this._minimumLevel)
                    this.Enrich.WithProperty(key, value);
                return this;
            }
        };

    public CreateLogger(): Zerilog {
        if (this._zinks.length === 0)
            throw new Error("No zinks have been added to the logger.");

        return new Zerilog({
            minimumLevel: this._minimumLevel,
            context: this._context,
            zinks: this._zinks
        });
    }
}
