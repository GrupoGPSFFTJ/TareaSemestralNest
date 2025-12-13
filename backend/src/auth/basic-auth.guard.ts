import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [type, credentials] = authHeader.split(' ');

    if (type !== 'Basic') {
      throw new UnauthorizedException('Invalid authentication type');
    }

    const [username, password] = Buffer.from(credentials, 'base64')
      .toString()
      .split(':');

    // Autenticación básica - en producción usar JWT
    if (username === 'admin' && password === 'password') {
      return true;
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}