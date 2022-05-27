import mongoose, { Model, Schema } from "mongoose";
import { LogLevel, ZerilogContext, ZerilogZink } from "zerilog";

const ZerilogSchema = new Schema({}, { strict: false });

export type MongooseZinkConfiguration = {
    createConnection?: boolean;
    collectionName?: string;
    uri: string;
    options?: mongoose.ConnectOptions;
    defaultProperties?: { [key: string]: string; };
};
export default class MongooseZink extends ZerilogZink {
    private _model: Model<any, {}, {}, {}>;
    constructor(private config: MongooseZinkConfiguration) {
        super();
        if (!('collectionName' in config)) config.collectionName = 'Zerilog';
        if (!('options' in config)) config.options = {};
        if (!('createConnection' in config)) config.createConnection = true;

        this._model = mongoose.model(config.collectionName, ZerilogSchema);

        if (config.createConnection && mongoose.connection.readyState != 1)
            mongoose.connect(config.uri, config.options);
    }

    SendLog(logContext: ZerilogContext): void {
        if (mongoose.connection.readyState != 1) return;

        this._model.create({
            Message: logContext.message,
            Level: LogLevel[logContext.logLevel],
            timestamp: new Date().toISOString(),
            Properties: {
                ...Object.fromEntries(logContext.properties),
                ...this.config?.defaultProperties,
            }
        });
    }
}