import { LoggerConfiguration } from "./LoggerConfiguration";
import { LogLevel } from "./typings";

export class MinimumLevel {
    constructor(private _config: LoggerConfiguration) { }

    private _setMinimumLevel(level: LogLevel) {
        this._config["_minimumLevel"] = level;

        return this._config;
    }

    public Debug() {
        return this._setMinimumLevel(LogLevel.Debug);
    }

    public Verbose() {
        return this._setMinimumLevel(LogLevel.Verbose);
    }

    public Information() {
        return this._setMinimumLevel(LogLevel.Information);
    }

    public Warning() {
        return this._setMinimumLevel(LogLevel.Warning);
    }

    public Error() {
        return this._setMinimumLevel(LogLevel.Error);
    }

    public Fatal() {
        return this._setMinimumLevel(LogLevel.Fatal);
    }
}
