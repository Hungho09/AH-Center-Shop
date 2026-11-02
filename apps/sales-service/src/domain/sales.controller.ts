import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SalesService } from './sales.service';
import { ApiResponse } from '@ql/common';

@Controller()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get('invoices')
  async getInvoices(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ): Promise<ApiResponse> {
    const data = await this.salesService.findAllInvoices(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 20,
    );
    return {
      success: true,
      statusCode: 200,
      message: 'Lấy danh sách hoá đơn thành công',
      data,
    };
  }

  @Get('invoices/:id')
  async getInvoiceById(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.salesService.findInvoiceById(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Lấy chi tiết hoá đơn thành công',
      data,
    };
  }

  @Post('invoices/:id/pay')
  async processPayment(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.salesService.processPayment(id);
    return {
      success: true,
      statusCode: 200,
      message: data.message,
      data,
    };
  }
}

