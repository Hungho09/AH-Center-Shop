import { Controller, Get, Param, Query } from '@nestjs/common';
import { HrService } from './hr.service';
import { ApiResponse } from '@ql/common';

@Controller()
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Get('employees')
  async getEmployees(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
  ): Promise<ApiResponse> {
    const data = await this.hrService.findAllEmployees(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 20,
      search,
    );
    return {
      success: true,
      statusCode: 200,
      message: 'Lấy danh sách nhân viên thành công',
      data,
    };
  }

  @Get('employees/:id')
  async getEmployeeById(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.hrService.findEmployeeById(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Lấy chi tiết nhân viên thành công',
      data,
    };
  }

  @Get('shifts')
  async getShifts(): Promise<ApiResponse> {
    const data = await this.hrService.findAllShifts();
    return {
      success: true,
      statusCode: 200,
      message: 'Lấy danh sách ca làm việc thành công',
      data,
    };
  }

  @Get('shift-assignments')
  async getShiftAssignments(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ): Promise<ApiResponse> {
    const data = await this.hrService.findAllShiftAssignments(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 20,
    );
    return {
      success: true,
      statusCode: 200,
      message: 'Lấy danh sách phân ca thành công',
      data,
    };
  }

  @Get('reports/salary-and-sales')
  async getSalaryAndSalesReport(): Promise<ApiResponse> {
    const data = await this.hrService.getSalaryAndSalesReport();
    return {
      success: true,
      statusCode: 200,
      message: 'Lấy báo cáo lương và doanh số nhân viên thành công',
      data,
    };
  }
}

