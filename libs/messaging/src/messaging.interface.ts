import { EventEnvelope } from '@ql/contracts';

export interface IMessagePublisher {
  publish<T>(routingKey: string, payload: T, correlationId?: string): Promise<boolean>;
}

export interface IMessageConsumer {
  subscribe<T>(
    queue: string,
    routingKey: string,
    handler: (message: EventEnvelope<T>) => Promise<void>,
  ): Promise<void>;
}

