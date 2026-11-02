import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiResponse } from '@ql/common';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('products')
  async getProducts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
  ): Promise<ApiResponse> {
    const data = await this.productService.findAllProducts(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 20,
      search,
    );
    return {
      success: true,
      statusCode: 200,
      message: 'Lấy danh sách sản phẩm thành công',
      data,
    };
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.productService.findProductById(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Lấy chi tiết sản phẩm thành công',
      data,
    };
  }

  @Get('categories')
  async getCategories(): Promise<ApiResponse> {
    const data = await this.productService.findAllCategories();
    return {
      success: true,
      statusCode: 200,
      message: 'Lấy danh sách danh mục thành công',
      data,
    };
  }

  @Get('inventory/stock-check/:id')
  async checkStock(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.productService.checkStock(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Kiểm tra tồn kho thành công',
      data,
    };
  }
}

