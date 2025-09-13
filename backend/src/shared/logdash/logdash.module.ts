import { createLogDash, Metrics, Logger } from '@logdash/js-sdk';
import { Global, Module } from '@nestjs/common';
import { getEnvConfig } from '../config/env-config';

@Global()
@Module({
  providers: [
    {
      provide: Logger,
      useFactory: () => {
        const { logger } = createLogDash({
          apiKey: getEnvConfig().logdash.apiKey,
        });

        return logger;
      },
    },
    {
      provide: Metrics,
      useFactory: () => {
        const { metrics } = createLogDash({
          apiKey: getEnvConfig().logdash.apiKey,
        });

        return metrics;
      },
    },
  ],
  exports: [Logger, Metrics],
})
export class LogdashModule {}
