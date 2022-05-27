import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { reIssueAccessToken } from '../service/session.service';
import { verifyJwt } from '../utils/jwt.utils';

async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = get(req, 'headers.authorization', '').replace(
    /^Bearer\s/,
    ''
  );
  const refreshToken = get(req, 'headers.x-refresh', '');

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJwt(accessToken);
  // if the token is verified
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }
  // if the token is not verifed and not exoired and the request header has a refresh token
  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);
    }
    const result = verifyJwt(newAccessToken as string);
    res.locals.user = result.decoded;
    return next();
  }
  return next();
}
export default deserializeUser;
