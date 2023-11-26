import _ from 'lodash';
import { NewUser } from '../../db/schema/users';
import { compare, encrypt } from '../../utils/encrypt.utils';
import { RegisterRepository } from './authentication.repository';
import { WrongCredentialsException } from '../../exceptions/unauthorized.exception';
import UserWithThatEmailAlreadyExistsException from '../../exceptions/user-exists.exception';

export class AuthService {
  private readonly repository: RegisterRepository;

  constructor() {
    this.repository = new RegisterRepository();
  }

  // * Register
  register = async (user: NewUser) => {
    try {
      const existedUser = await this.repository.getUser(user.email);

      if (!_.isEmpty(existedUser)) {
        throw new UserWithThatEmailAlreadyExistsException(user.email);
      }

      const hashedPwd = await encrypt(user.password);
      await this.repository.createUser({ ...user, password: hashedPwd });
    } catch (error) {
      throw error;
    }
  };

  // * Login
  login = async (email: string, password: string) => {
    try {
      const token: string = '';
      const refreshToken: string = '';
      const user = await this.repository.getUser(email);

      if (_.isEmpty(user)) {
        throw new WrongCredentialsException();
      }

      const { password: encryptedPassword } = user[0];

      const isPasswordMatched = await compare(password, encryptedPassword);

      if (isPasswordMatched) {
        // create token and refresh token
      }

      return {
        token,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  };
}
