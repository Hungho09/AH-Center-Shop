import { Controller, Get, Param, Query } from '@nestjs/common';
import { InventoryLossService } from './inventory-loss.service';
import { ApiResponse } from '@ql/common';

@Controller('inventory-loss')
export class InventoryLossController {
  constructor(private readonly lossService: InventoryLossService) {}

  @Get()
  async getLossRecords(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ): Promise<ApiResponse> {
    const data = await this.lossService.findAllLossRecords(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 20,
    );
    return {
      success: true,
      statusCode: 200,
      message: 'Lấy danh sách phiếu hủy hàng thành công',
      data,
    };
  }

  @Get(':id')
  async getLossRecordById(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.lossService.findLossRecordById(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Lấy chi tiết phiếu hủy hàng thành công',
      data,
    };
  }
}

