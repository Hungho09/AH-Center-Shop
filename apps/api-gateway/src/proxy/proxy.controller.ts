import { All, Controller, HttpStatus, Logger, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import {
  HEADER_CORRELATION_ID,
  HEADER_REQUEST_ID,
  HEADER_USER_ID,
  HEADER_USER_ROLE,
  Public,
  UserContext,
} from '@ql/common';

@Controller()
export class ProxyController {
  private readonly logger = new Logger(ProxyController.name);

  private readonly routes: Record<string, string> = {
    auth: process.env.IDENTITY_SERVICE_URL || 'http://localhost:3001',
    products: process.env.PRODUCT_INVENTORY_SERVICE_URL || 'http://localhost:3002',
    categories: process.env.PRODUCT_INVENTORY_SERVICE_URL || 'http://localhost:3002',
    inventory: process.env.PRODUCT_INVENTORY_SERVICE_URL || 'http://localhost:3002',
    purchases: process.env.PURCHASE_SERVICE_URL || 'http://localhost:3003',
    suppliers: process.env.PURCHASE_SERVICE_URL || 'http://localhost:3003',
    sales: process.env.SALES_SERVICE_URL || 'http://localhost:3004',
    invoices: process.env.SALES_SERVICE_URL || 'http://localhost:3004',
    customers: process.env.CUSTOMER_LOYALTY_SERVICE_URL || 'http://localhost:3005',
    loyalty: process.env.CUSTOMER_LOYALTY_SERVICE_URL || 'http://localhost:3005',
    employees: process.env.HR_SERVICE_URL || 'http://localhost:3006',
    shifts: process.env.HR_SERVICE_URL || 'http://localhost:3006',
    'shift-assignments': process.env.HR_SERVICE_URL || 'http://localhost:3006',
    reports: process.env.HR_SERVICE_URL || 'http://localhost:3006',
    'inventory-loss': process.env.INVENTORY_LOSS_SERVICE_URL || 'http://localhost:3007',
  };

  @All(':prefix*')
  @Public()
  async handleProxy(@Req() req: Request, @Res() res: Response) {
    const originalUrl = req.originalUrl; // e.g. /api/products/123
    const pathWithoutApi = originalUrl.replace(/^\/api\//, '');
    const segments = pathWithoutApi.split('/');
    const prefix = segments[0]?.split('?')[0];

    const targetBaseUrl = this.routes[prefix];

    if (!targetBaseUrl) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: `Tuyến API '/api/${prefix}' không tồn tại trên API Gateway`,
        error: {
          code: 'RESOURCE_NOT_FOUND',
          timestamp: new Date().toISOString(),
          path: originalUrl,
          correlationId: req.headers[HEADER_CORRELATION_ID] as string,
        },
      });
    }

    const targetUrl = `${targetBaseUrl}${originalUrl}`;
    const user = (req as any).user as UserContext | undefined;

    const forwardHeaders: Record<string, string> = {
      ...(req.headers as Record<string, string>),
      host: new URL(targetBaseUrl).host,
    };

    if (req.headers[HEADER_CORRELATION_ID]) {
      forwardHeaders[HEADER_CORRELATION_ID] = req.headers[HEADER_CORRELATION_ID] as string;
    }
    if (req.headers[HEADER_REQUEST_ID]) {
      forwardHeaders[HEADER_REQUEST_ID] = req.headers[HEADER_REQUEST_ID] as string;
    }
    if (user) {
      forwardHeaders[HEADER_USER_ID] = user.sub;
      forwardHeaders[HEADER_USER_ROLE] = user.role;
    }

    try {
      const downstreamResponse = await axios({
        method: req.method,
        url: targetUrl,
        headers: forwardHeaders,
        data: req.body,
        params: req.query,
        validateStatus: () => true, // Forward all status codes directly
        timeout: 15000,
      });

      return res.status(downstreamResponse.status).json(downstreamResponse.data);
    } catch (err: any) {
      const axiosError = err as AxiosError;
      if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ENOTFOUND') {
        this.logger.warn(`Downstream service at ${targetBaseUrl} unreachable (${axiosError.code})`);
        return res.status(HttpStatus.BAD_GATEWAY).json({
          success: false,
          statusCode: HttpStatus.BAD_GATEWAY,
          message: `Dịch vụ xử lý downstream tại '${prefix}' hiện không khả dụng`,
          error: {
            code: 'DOWNSTREAM_SERVICE_ERROR',
            details: axiosError.message,
            timestamp: new Date().toISOString(),
            path: originalUrl,
            correlationId: req.headers[HEADER_CORRELATION_ID] as string,
          },
        });
      }

      this.logger.error(`Proxy forwarding error: ${err.message}`, err.stack);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Lỗi chuyển tiếp yêu cầu từ API Gateway',
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          details: err.message,
          timestamp: new Date().toISOString(),
          path: originalUrl,
        },
      });
    }
  }
}
