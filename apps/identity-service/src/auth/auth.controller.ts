import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto, TokenResponseDto } from '@ql/contracts';
import { ApiResponse, CurrentUser, Public, UserContext } from '@ql/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginRequestDto): Promise<ApiResponse<TokenResponseDto>> {
    const result = await this.authService.login(dto);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Đăng nhập thành công',
      data: result,
    };
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body('refreshToken') refreshToken: string,
  ): Promise<ApiResponse<Partial<TokenResponseDto>>> {
    const result = await this.authService.refreshToken(refreshToken);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Làm mới token thành công',
      data: result,
    };
  }

  @Get('profile')
  getProfile(@CurrentUser() user: UserContext): ApiResponse<UserContext> {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Lấy thông tin người dùng thành công',
      data: user,
    };
  }
}
