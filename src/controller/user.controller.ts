import { Request, Response } from 'express';
import { CreateUserInput } from '../schema/user.schema';
import { createUserService } from '../service/user.service';
import log from '../utils/logger';

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput['body']>,
  res: Response
) {
  try {
    const user = await createUserService(req.body);
    return res.status(201).json(user);
  } catch (err: any) {
    log.error(err);
    return res.status(409).json({ err: err.message });
  }
}

export function logOutHandler(req: Request, res: Response) {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'Success' });
}
