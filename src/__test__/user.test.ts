import * as UserService from '../service/user.service';
import mongoose from 'mongoose';
import createServer from '../utils/server';
import supertest from 'supertest';
import * as SessionService from '../service/session.service';
import { createSessionHandler } from '../controller/session.controller';

const app = createServer();
const userId = new mongoose.Types.ObjectId().toString();

export const userPayload = {
  _id: userId,
  email: 'jane.doe@example.com',
  name: 'Jane Doe',
};

const userInput = {
  email: 'test@example.com',
  name: 'Jane Doe',
  password: 'Password123',
  passwordConfirmation: 'Password123',
};

const sessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: userId,
  valid: true,
  userAgent: 'PostmanRuntime/7.28.4',
  createdAt: new Date('2021-09-30T13:31:07.674Z'),
  updatedAt: new Date('2021-09-30T13:31:07.674Z'),
  __v: 0,
};

describe('user', () => {
  // user registeration
  describe('user registeration', () => {
    // test for user credentials valiation
    describe('user credentials are valid ', () => {
      it('should return the user payload', async () => {
        const createUseServiceMock = jest
          .spyOn(UserService, 'createUserService')
          // @ts-ignore
          .mockReturnValueOnce(userPayload);
        const { statusCode, body } = await supertest(app)
          .post('/api/users')
          .send(userInput);
        expect(statusCode).toBe(201);
        expect(body).toEqual(userPayload);
        expect(createUseServiceMock).toHaveBeenCalledWith(userInput);
      });
    });
    // test for password matches
    describe('passwords dont match', () => {
      it('should return a 400 error', async () => {
        const createUseServiceMock = jest
          .spyOn(UserService, 'createUserService')
          // @ts-ignore
          .mockReturnValueOnce(userPayload);
        const { statusCode } = await supertest(app)
          .post('/api/users')
          .send({ ...userInput, passwordConfirmation: 'dontmatch' });
        expect(statusCode).toBe(400);
        expect(createUseServiceMock).not.toHaveBeenCalled();
      });
    });
    // test for user registeration handled errors
    describe('user registeration throws and error ', () => {
      it('should return a 409 error', async () => {
        const createUseServiceMock = jest
          .spyOn(UserService, 'createUserService')
          // @ts-ignore
          .mockRejectedValue('AN ERROR OCCURED');
        const { statusCode } = await supertest(app)
          .post('/api/users')
          .send(userInput);
        expect(statusCode).toBe(409);
        expect(createUseServiceMock).toHaveBeenCalledWith(userInput);
      });
    });
  });

  describe('create user session', () => {
    describe('given a valid email and password', () => {
      it('should return a valid access token and refresh token', async () => {
        jest
          .spyOn(UserService, 'validatePassword')
          // @ts-ignore
          .mockReturnValue(userPayload);
        jest
          .spyOn(SessionService, 'createSession')
          // @ts-ignore
          .mockReturnValue(sessionPayload);
        const req = {
          get: () => {
            return 'NetScape';
          },
          body: {
            email: 'richard@example.com',
            password: 'userpass',
          },
        };
        const send = jest.fn();
        const res = {
          send,
        };
        // @ts-ignore
        await createSessionHandler(req, res);
        expect(send).toHaveBeenCalledWith({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
    });
  });
});
