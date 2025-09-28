import { PostHog } from 'posthog-node';
import { getEnvConfig } from '../config/env-config';

export const posthog = new PostHog(getEnvConfig().posthog.apiKey, {
  host: getEnvConfig().posthog.host,
});
