import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserContext } from '@ql/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret-key-1234567890',
    });
  }

  async validate(payload: any): Promise<UserContext> {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
    return {
      sub: payload.sub,
      maNhanVien: payload.maNhanVien || payload.sub,
      tenNhanVien: payload.tenNhanVien || '',
      role: payload.role,
      maChucVu: payload.maChucVu,
    };
  }
}

