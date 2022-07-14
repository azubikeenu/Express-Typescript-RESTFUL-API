import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { reIssueAccessToken } from '../service/session.service';
import { verifyJwt } from '../utils/jwt.utils';
import { UserDocument } from '../models/user.model';

type UserJwtPayload = {
  user: UserDocument;
};

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
    const mappedDecoded = decoded as UserJwtPayload;
    res.locals.user = mappedDecoded.user;
    return next();
  }
  // if the token is not verifed and not exoired and the request header has a refresh token
  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);
    }
    const result = verifyJwt(newAccessToken as string);
    const mappedDecoded = result.decoded as UserJwtPayload;
    res.locals.user = mappedDecoded.user;
    return next();
  }
  return next();
}
export default deserializeUser;
