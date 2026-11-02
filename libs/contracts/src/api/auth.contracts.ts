import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;
}

export interface TokenResponseDto {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    maNhanVien: string;
    tenNhanVien: string;
    role: string;
    maChucVu: string | number;
  };
}

