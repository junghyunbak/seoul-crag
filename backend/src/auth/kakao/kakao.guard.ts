import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class KakaoAuthGuard extends AuthGuard('kakao') {
  /**
   * 로그인 후 리다이렉트할 URL를 상태로 보관
   */
  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const returnTo = request.query.returnTo || '/';
    return {
      state: encodeURIComponent(returnTo),
    };
  }

  handleRequest(err, user, info, context, status) {
    return super.handleRequest(err, user, info, context, status);
  }
}
