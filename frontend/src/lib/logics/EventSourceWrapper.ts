import { EventSource } from "eventsource";

export interface EventSourceConfig {
  url: string;
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}

export class EventSourceWrapper {
  private eventSource: EventSource;

  constructor(config: EventSourceConfig) {
    this.eventSource = new EventSource(config.url, {
      // @ts-ignore
      fetch: config.fetch,
    });
  }

  onMessage(handler: (event: { data: string }) => void): void {
    this.eventSource.onmessage = handler as any;
  }

  onError(handler: () => void): void {
    this.eventSource.onerror = handler as any;
  }

  close(): void {
    this.eventSource.close();
  }
}
