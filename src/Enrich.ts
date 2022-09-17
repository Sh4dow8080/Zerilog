import { LoggerConfiguration } from "./LoggerConfiguration";
import { LogLevel } from "./typings";

export class Enrich {
    constructor(private _config: LoggerConfiguration) { }

    public WithProperty(key: string, value: string): LoggerConfiguration {
        if (this._config["_context"].has(key))
            throw new Error(`Property ${key} already exists`);

        this._config["_context"].set(key, value);
        return this._config;
    }

    public When(condition: () => boolean, key: string, value: string): LoggerConfiguration {
        if (condition())
            this.WithProperty(key, value);
        return this._config;
    }

    public AtLevel(level: LogLevel, key: string, value: string): LoggerConfiguration {
        if (level === this._config["_minimumLevel"])
            this.WithProperty(key, value);
        return this._config;
    }
}
