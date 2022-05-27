import { request } from 'https';
import { LogLevel, ZerilogContext, ZerilogZink } from "zerilog";

export type HumioZinkConfiguration = {
    ingestToken: string;
    defaultProperties?: { [key: string]: string; };
};
export default class HumioZink extends ZerilogZink {
    private readonly _humioUrl: string = "https://cloud.humio.com/api/v1/ingest/humio-structured";

    constructor(
        private readonly configuration: HumioZinkConfiguration
    ) { super(); }

    toJSON() {
        let config = {
            ...this.configuration,
        };

        config.ingestToken = config.ingestToken.replace(/./gi, '*');
        return {
            type: 'HumioZink',
            configuration: config,
        };
    }

    SendLog(logContext: ZerilogContext): void {
        let requestBody = [{
            events: [
                {
                    timestamp: new Date().toISOString(),
                    attributes: {
                        Message: logContext.message,
                        exception: undefined,
                        Level: LogLevel[logContext.logLevel],
                        Properties: {
                            ...Object.fromEntries(logContext.properties),
                            ...this.configuration?.defaultProperties,
                        },
                    }
                },
            ]
        }];

        if (logContext?.options !== undefined) {
            if ('exception' in logContext.options) {
                requestBody[0].events[0].attributes.exception = {
                    message: logContext.options.exception.message ?? undefined,
                    stack: logContext.options.exception.stack ?? undefined,
                };
            }
        }

        let postData = JSON.stringify(requestBody);
        let requestOptions = {
            hostname: 'cloud.humio.com',
            port: 443,
            path: this._humioUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'Authorization': 'Bearer ' + this.configuration.ingestToken,
            }
        };

        request(requestOptions).write(postData);
        // axios.post(this._humioUrl, requestBody, requestOptions).catch(console.error);
    }
}