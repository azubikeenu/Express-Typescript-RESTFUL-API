import { Request, Response, NextFunction } from 'express';
import {
  createSession,
  deleteSession,
  findSession,
} from '../service/session.service';
import { validatePassword } from '../service/user.service';
import { signJwt } from '../utils/jwt.utils';
import config from 'config';
import { createSessionInput } from '../schema/session.schema';

export async function createSessionHandler(
  req: Request<{}, {}, createSessionInput['body']>,
  res: Response,
  next: NextFunction
) {
  // Validate the user password
  const user = await validatePassword(req.body);
  if (!user)
    return res
      .status(401)
      .json({ error: true, message: 'Invalid email or password' });
  // Create the user session with email and password
  const session = await createSession(user._id, req.get('user-agent') || '');
  // Create the access token
  const accessToken = signJwt(
    { user, session: session._id },
    {
      expiresIn: config.get('accessTokenExpires'),
    }
  );
  // Create the refresh token
  const refreshToken = signJwt(
    { user, session: session._id },
    {
      expiresIn: config.get('refreshTokenExpires'),
    }
  );
  // return the access and refresh token
  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = res.locals.user._id;
  const sessions = await findSession({ user, valid: true });
  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const { session } = res.locals.user;
  await deleteSession({ _id: session }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
