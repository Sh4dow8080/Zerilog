import { LogLevel, ZerilogContext, ZerilogZink } from "./typings";
export class ConsoleZink extends ZerilogZink {
    SendLog(logContext: ZerilogContext): void {
        console.log(
            `[${LogLevel[logContext.logLevel]}] ${logContext.message}`,
            logContext.properties,
            logContext.options?.exception && { message: logContext.options.exception.message, stack: logContext.options.exception?.stack },
            new Date()
        );
    }
}
