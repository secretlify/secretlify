import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/auth/core/decorators/is-public';
import { getEnvConfig } from '../config/env-config';
import { getOurEnv, OurEnv } from '../types/our-env.enum';
import { posthog } from './posthog.client';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  public constructor(private readonly reflector: Reflector) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (getOurEnv() === OurEnv.Dev) {
      return next.handle();
    }

    const sampleRate = getEnvConfig().posthog.sampleRate;
    if (Math.random() > sampleRate) {
      return next.handle();
    }

    const now = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    response.on('finish', () => {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      const userId = (request as any).user?.id;

      if (isPublic || userId) {
        posthog.capture({
          distinctId: userId ?? 'anonymous',
          event: 'API Call',
          properties: {
            latency: Date.now() - now,
            method: request.method,
            path: request.route.path,
            statusCode: response.statusCode,
            $current_url: request.path,
          },
        });
      }
    });

    return next.handle();
  }
}
