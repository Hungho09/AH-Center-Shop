export interface HealthStatus {
  status: 'ok' | 'error' | 'shutting_down';
  service: string;
  version: string;
  timestamp: string;
  uptime: number;
  dependencies?: {
    database?: 'connected' | 'disconnected' | 'not_configured';
    redis?: 'connected' | 'disconnected' | 'not_configured';
    rabbitmq?: 'connected' | 'disconnected' | 'not_configured';
  };
}

