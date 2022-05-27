import { FilterQuery, UpdateQuery } from 'mongoose';
import Session, { SessionDocument } from '../models/session.model';
import { signJwt, verifyJwt } from '../utils/jwt.utils';
import { get } from 'lodash';
import { findUser } from './user.service';
import config from 'config';

export async function createSession(userId: String, userAgent: String) {
  try {
    const session = await Session.create({ user: userId, userAgent });
    return session.toJSON();
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export async function findSession(query: FilterQuery<SessionDocument>) {
  return Session.find(query).lean();
}

export async function deleteSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return Session.updateOne(query, update);
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, 'session')) return false;

  // Get the session of the user
  const session = await Session.findById(get(decoded, 'session'));

  // Check of the user has a valid sesssion
  if (!session || !session.valid) return false;

  // Check if the user still exists
  const user = await findUser({ _id: session.user });

  if (!user) return false;

  // Use the returned user and the current session to generate a new access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get('accessTokenExpires') } // 15 minutes
  );

  // return the new access token for verification
  return accessToken;
}
