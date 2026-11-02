import { Controller, Get, Param, Query } from '@nestjs/common';
import { CustomerLoyaltyService } from './customer-loyalty.service';
import { ApiResponse } from '@ql/common';

@Controller()
export class CustomerLoyaltyController {
  constructor(private readonly customerService: CustomerLoyaltyService) {}

  @Get('customers')
  async getCustomers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
  ): Promise<ApiResponse> {
    const data = await this.customerService.findAllCustomers(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 20,
      search,
    );
    return {
      success: true,
      statusCode: 200,
      message: 'Lấy danh sách khách hàng thành công',
      data,
    };
  }

  @Get('customers/:id')
  async getCustomerById(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.customerService.findCustomerById(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Lấy chi tiết khách hàng thành công',
      data,
    };
  }

  @Get('customers/phone/:phone')
  async getCustomerByPhone(@Param('phone') phone: string): Promise<ApiResponse> {
    const data = await this.customerService.findCustomerByPhone(phone);
    return {
      success: true,
      statusCode: 200,
      message: 'Tìm kiếm khách hàng theo số điện thoại thành công',
      data,
    };
  }

  @Get('loyalty/tiers')
  async getTiers(): Promise<ApiResponse> {
    const data = await this.customerService.findAllTiers();
    return {
      success: true,
      statusCode: 200,
      message: 'Lấy danh sách hạng thành viên thành công',
      data,
    };
  }
}

