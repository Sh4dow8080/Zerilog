import Zerilog from ".";
import { Enrich } from "./Enrich";
import { MinimumLevel } from "./MinimumLevel";
import { LogLevel, ZerilogZink, ZinkWithCondition, ZinkWithConditionMethod } from "./typings";

export class LoggerConfiguration {
    private _minimumLevel: LogLevel = LogLevel.Debug;
    private _context: Map<string, any> = new Map();
    private _zinks: ZinkWithCondition[] = [];

    public get Enrich() {
        return new Enrich(this);
    };

    public get MinimumLevel() {
        return new MinimumLevel(this);
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
