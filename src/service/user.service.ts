import { DocumentDefinition, FilterQuery } from 'mongoose';
import User, { UserDocument } from '../models/user.model';
import { omit } from 'lodash';

export async function createUserService(
  input: DocumentDefinition<
    Omit<UserDocument, 'createdAt' | 'updatedAt' | 'comparePassword'>
  >
) {
  try {
    const user = await User.create(input);
    return omit(user.toJSON(), 'password');
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), 'password');
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return User.findOne(query);
}
