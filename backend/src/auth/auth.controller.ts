import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterOrgDto } from './dto/register-org.dto';
import { RegisterWithOrgDto } from './dto/register-with-org.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('register/org')
  registerOrg(@Body() registerOrgDto: RegisterOrgDto) {
    return this.authService.registerOrg(registerOrgDto);
  }

  @Post('register/join/:slug')
  async registerWithOrg(@Param('slug') slug: string, @Body() dto: RegisterWithOrgDto) {
    const token = await this.authService.registerWithOrg(slug, dto);
    return { success: true, data: { token }, message: 'Registered successfully' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
