import mongoose, { Model, Schema } from "mongoose";
import { LogLevel, ZerilogContext, ZerilogZink } from "zerilog/lib/typings";

const ZerilogSchema = new Schema({}, { strict: false, timestamps: { createdAt: true, updatedAt: false } });

export type MongooseZinkConfiguration = {
    createConnection?: boolean;
    collectionName?: string;
    uri: string;
    options?: mongoose.ConnectOptions;
};
export default class MongooseZink extends ZerilogZink {
    private _model: Model<any, {}, {}, {}>;
    constructor(config: MongooseZinkConfiguration) {
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
            logLevel: LogLevel[logContext.logLevel],
            message: logContext.message,
            ...Object.fromEntries(logContext.properties),
            exception: logContext?.options?.exception
        });
    }
}