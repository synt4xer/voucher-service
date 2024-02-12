import _ from 'lodash';
import { encrypt } from '../../utils/encrypt.util';
import { UsersRepository } from './users.repository';
import { NewUser, User } from '../../db/schema/users';
import { UserEmailAlreadyExistsException } from '../../exceptions/bad-request.exception';

export class UsersService {
  private readonly repository: UsersRepository;

  constructor() {
    this.repository = new UsersRepository();
  }

  getAll = async (name?: string) => this.repository.getUsers(name);
  getOne = async (id: number) => this.repository.getUsersById(id);
  getByName = async (name: string) => this.repository.getUsersByEmail(name);
  searchByName = async (name: string) => this.repository.searchUsersByName(name);
  create = async (newUser: NewUser) => {
    try {
      const existingUser = await this.repository.getUsersByEmail(newUser.email);

      if (!_.isEmpty(existingUser)) {
        throw new UserEmailAlreadyExistsException(newUser.email);
      }

      const hashedPwd = await encrypt(newUser.password);

      return this.repository.createUser({ ...newUser, password: hashedPwd });
    } catch (error) {
      throw error;
    }
  };
  update = async (user: User, id: number) => {
    const { password, ...rest } = user;
    const hashedPwd = await encrypt(password);

    const updatedUser = {
      ...rest,
      password: hashedPwd,
    };

    return this.repository.updateUser(updatedUser, id);
  };
  delete = async (id: number) => {
    try {
      await this.repository.deleteUser(id);
    } catch (error) {
      throw error;
    }
  };
}
