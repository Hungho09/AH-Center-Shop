import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto, TokenResponseDto } from '@ql/contracts';
import { SystemRole } from '@ql/common';
import { AppException, ErrorCode } from '@ql/exceptions';
import { BcryptHasherService } from './bcrypt-hasher.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly passwordHasher: BcryptHasherService,
  ) {}

  async login(dto: LoginRequestDto): Promise<TokenResponseDto> {
    // Stage 1 Finding: Database currently DOES NOT have TAIKHOAN table (ADR-003 pending approval).
    // In accordance with Global Execution Rules:
    // We provide authentication scaffolding for development/testing accounts while logging pending status.
    if (dto.username === 'admin' && dto.password === 'Admin@123456') {
      const payload = {
        sub: 'NV_ADMIN',
        maNhanVien: 'NV_ADMIN',
        tenNhanVien: 'Hệ Thống Quản Trị',
        role: SystemRole.ADMIN,
        maChucVu: 'CV_ADMIN',
      };

      const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      return {
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: 86400,
        user: {
          maNhanVien: payload.maNhanVien,
          tenNhanVien: payload.tenNhanVien,
          role: payload.role,
          maChucVu: payload.maChucVu,
        },
      };
    }

    // Cashier role testing account
    if (dto.username === 'cashier' && dto.password === 'Cashier@123456') {
      const payload = {
        sub: 'NV_THUNGAN',
        maNhanVien: 'NV001',
        tenNhanVien: 'Nhân Viên Thu Ngân',
        role: SystemRole.CASHIER,
        maChucVu: 'CV_TN',
      };

      const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      return {
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: 86400,
        user: {
          maNhanVien: payload.maNhanVien,
          tenNhanVien: payload.tenNhanVien,
          role: payload.role,
          maChucVu: payload.maChucVu,
        },
      };
    }

    throw new AppException(
      'Tài khoản không tồn tại hoặc sai mật khẩu. Lưu ý: Bảng TAIKHOAN đang ở trạng thái Pending Approval (ADR-003).',
      ErrorCode.UNAUTHORIZED,
      401,
      { adrStatus: 'PENDING_APPROVAL', adrId: 'ADR-003' },
    );
  }

  async refreshToken(refreshToken: string): Promise<Partial<TokenResponseDto>> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newPayload = {
        sub: payload.sub,
        maNhanVien: payload.maNhanVien,
        tenNhanVien: payload.tenNhanVien,
        role: payload.role,
        maChucVu: payload.maChucVu,
      };

      const accessToken = this.jwtService.sign(newPayload, { expiresIn: '1d' });
      return {
        accessToken,
        tokenType: 'Bearer',
        expiresIn: 86400,
      };
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }
}

