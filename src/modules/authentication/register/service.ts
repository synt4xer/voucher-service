import _ from 'lodash';
import { logger } from '../../../utils/logger';
import { NewUser } from '../../../db/schema/users';
import { encrypt } from '../../../utils/encrypt.utils';
import { RegisterRepository } from './repository';
import UserWithThatEmailAlreadyExistsException from '../../../exceptions/user-exists.exception';

export class RegisterService {
  private readonly repository: RegisterRepository;

  constructor() {
    this.repository = new RegisterRepository();
  }

  register = async (user: NewUser) => {
    try {
      const existedUser = await this.repository.getUser(user.email);

      if (!_.isEmpty(existedUser)) {
        throw new UserWithThatEmailAlreadyExistsException(user.email);
      }

      const hashedPwd = await encrypt(user.password);
      await this.repository.createUser({ ...user, password: hashedPwd });
    } catch (error) {
      logger.error(error);
      throw error;
    }
  };
}
