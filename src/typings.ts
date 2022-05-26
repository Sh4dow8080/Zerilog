export abstract class ZerilogZink {
    abstract SendLog(logContext: ZerilogContext): void;
    toJSON(): { type: string, [key: string]: any; } {
        return {
            type: this.constructor.name,
        };
    }
}

export type ZinkWithConditionMethod = (zeriContext: ZerilogContext) => boolean;

export type ZinkWithCondition = {
    zink: ZerilogZink;
    condition: ZinkWithConditionMethod;
};

export type ZerilogContext = {
    logLevel: LogLevel;
    message: string;
    properties: Map<string, any>;
    options?: LogMessageOptions;
};

export type LogMessageOptions = {
    exception?: Error;
};

export enum LogLevel {
    Fatal = 5,
    Error = 4,
    Warning = 3,
    Information = 2,
    Debug = 1,
    Verbose = 0
}

export type ZerilogConfiguration = {
    minimumLevel: LogLevel;
    context: Map<string, any>;
    zinks: Array<ZinkWithCondition>;
};