import { Request, Response } from 'express';
import { CreateUseInput } from '../schema/user.schema';
import { createUserService } from '../service/user.service';
import log from '../utils/logger';

export async function createUserHandler(
  req: Request<{}, {}, CreateUseInput['body']>,
  res: Response
) {
  try {
    const user = await createUserService(req.body);
    return res.status(201).json({ data: user });
  } catch (err: any) {
    log.error(err);
    return res.status(409).json({ err: err.message });
  }
}
