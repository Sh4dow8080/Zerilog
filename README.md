# Zerilog - Serilog for Typescript

#### Creating a simple logger
```ts
import { LoggerConfiguration, ConsoleZink } from 'zerilog';

const Logger = new LoggerConfiguration()
    .WriteTo(new ConsoleZink())
    .CreateLogger();
```

#### Creating a simple logger that is accessable from anywhere
```ts
import Zerilog, { LoggerConfiguration, ConsoleZink } from 'zerilog';

Zerilog.Logger = new LoggerConfiguration()
    .WriteTo(new ConsoleZink())
    .CreateLogger();
```

#### Using the logger
```ts
import Zerilog from 'zerilog';

Zerilog.Logger
    .Information("Hello World!");
```

---

#### Creating a custom 'zink' for the logger
```ts
import { ZerilogZink, ZerilogContext } from 'zerilog';

class CustomZink extends ZerilogZink {
    SendLog(logContext: ZerilogContext): void {}
}
```