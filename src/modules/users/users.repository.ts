import db from '../../db';
import { and, eq, ilike } from 'drizzle-orm';
import { NewUser, User, users } from '../../db/schema/users';
import _ from 'lodash';

const column = {
  id: users.id,
  uuid: users.uuid,
  name: users.name,
  email: users.email,
  dob: users.dob,
  phone: users.phone,
  address: users.address,
  role: users.role,
  isActive: users.isActive,
};

export class UsersRepository {
  getUsers = async (name?: string) => {
    if (name) {
      return db
        .select(column)
        .from(users)
        .where(ilike(users.name, `%${name}%`));
    }

    return db.select(column).from(users);
  };
  // getUsers = async () => db.select(column).from(users).where(eq(users.isActive, true));
  getUsersById = async (id: number) =>
    db
      .select(column)
      .from(users)
      .where(and(eq(users.isActive, true), eq(users.id, id)));
  searchUsersByName = async (name: string) =>
    db
      .select(column)
      .from(users)
      .where(and(eq(users.isActive, true), ilike(users.name, `%${name}%`)));
  getUsersByEmail = async (email: string) =>
    db
      .select(column)
      .from(users)
      .where(and(eq(users.isActive, true), eq(users.email, email)));
  createUser = async (newUser: NewUser) => db.insert(users).values(newUser).returning(column);
  updateUser = async (user: User, id: number) =>
    db.update(users).set(user).where(eq(users.id, id)).returning(column);
  deleteUser = async (id: number) =>
    db.update(users).set({ isActive: false }).where(eq(users.id, id));
}
