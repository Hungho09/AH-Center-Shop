import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  it('should return ok health status', () => {
    const res = controller.check();
    expect(res.status).toBe('ok');
    expect(res.service).toBe('api-gateway');
    expect(res.version).toBe('1.0.0');
    expect(typeof res.uptime).toBe('number');
  });
});

