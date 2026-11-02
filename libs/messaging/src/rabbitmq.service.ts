import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { randomUUID } from 'crypto';
import { EXCHANGE_DLX, EXCHANGE_MAIN } from '@ql/common';
import { EventEnvelope } from '@ql/contracts';
import { IMessageConsumer, IMessagePublisher } from './messaging.interface';

@Injectable()
export class RabbitMQService
  implements IMessagePublisher, IMessageConsumer, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: any = null;
  private channel: any = null;
  private isConnected = false;

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  get healthStatus(): 'connected' | 'disconnected' | 'not_configured' {
    return this.isConnected ? 'connected' : 'disconnected';
  }

  async connect(): Promise<boolean> {
    const url = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
    try {
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      // Setup main topic exchange
      await this.channel.assertExchange(EXCHANGE_MAIN, 'topic', { durable: true });
      // Setup DLX exchange
      await this.channel.assertExchange(EXCHANGE_DLX, 'topic', { durable: true });

      this.isConnected = true;
      this.logger.log(`Connected to RabbitMQ at ${url}`);
      return true;
    } catch (err: any) {
      this.isConnected = false;
      this.logger.warn(`RabbitMQ not available (${err.message}). Running in decoupled mode.`);
      return false;
    }
  }

  async disconnect() {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
    } catch (e) {
      // Ignore on shutdown
    } finally {
      this.isConnected = false;
    }
  }

  async publish<T>(routingKey: string, payload: T, correlationId?: string): Promise<boolean> {
    if (!this.isConnected || !this.channel) {
      this.logger.debug(`[MOCK/OFFLINE] RabbitMQ publish skipped for key ${routingKey}`);
      return false;
    }

    const envelope: EventEnvelope<T> = {
      eventId: randomUUID(),
      eventType: routingKey,
      occurredOn: new Date().toISOString(),
      correlationId: correlationId || randomUUID(),
      payload,
    };

    const buffer = Buffer.from(JSON.stringify(envelope));
    return this.channel.publish(EXCHANGE_MAIN, routingKey, buffer, {
      persistent: true,
      correlationId: envelope.correlationId,
      messageId: envelope.eventId,
      timestamp: Date.now(),
    });
  }

  async subscribe<T>(
    queue: string,
    routingKey: string,
    handler: (message: EventEnvelope<T>) => Promise<void>,
  ): Promise<void> {
    if (!this.isConnected || !this.channel) {
      this.logger.debug(`[MOCK/OFFLINE] RabbitMQ subscribe skipped for queue ${queue}`);
      return;
    }

    await this.channel.assertQueue(queue, {
      durable: true,
      deadLetterExchange: EXCHANGE_DLX,
    });
    await this.channel.bindQueue(queue, EXCHANGE_MAIN, routingKey);

    await this.channel.consume(
      queue,
      async (msg: any) => {
        if (!msg) return;
        try {
          const content = JSON.parse(msg.content.toString()) as EventEnvelope<T>;
          await handler(content);
          this.channel?.ack(msg);
        } catch (error: any) {
          this.logger.error(
            `Error processing message from ${queue}: ${error.message}`,
            error.stack,
          );
          // Reject and send to DLQ
          this.channel?.nack(msg, false, false);
        }
      },
      { noAck: false },
    );
  }
}
