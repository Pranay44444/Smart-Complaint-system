import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from '../../users/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super_secret_jwt_key',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.usersRepository.findById(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException();
    }
    
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
