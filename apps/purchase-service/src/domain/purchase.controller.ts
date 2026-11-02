import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { ApiResponse } from '@ql/common';

@Controller()
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Get('purchases')
  async getPurchases(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ): Promise<ApiResponse> {
    const data = await this.purchaseService.findAllPurchases(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 20,
    );
    return {
      success: true,
      statusCode: 200,
      message: 'Lấy danh sách phiếu nhập hàng thành công',
      data,
    };
  }

  @Get('purchases/:id')
  async getPurchaseById(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.purchaseService.findPurchaseById(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Lấy chi tiết phiếu nhập hàng thành công',
      data,
    };
  }

  @Get('suppliers')
  async getSuppliers(): Promise<ApiResponse> {
    const data = await this.purchaseService.findAllSuppliers();
    return {
      success: true,
      statusCode: 200,
      message: 'Lấy danh sách nhà cung cấp thành công',
      data,
    };
  }

  @Post('purchases/:id/complete')
  async completePurchase(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.purchaseService.completePurchaseOrder(id);
    return {
      success: true,
      statusCode: 200,
      message: data.message,
      data,
    };
  }
}

