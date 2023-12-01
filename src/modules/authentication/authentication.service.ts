import _ from 'lodash';
import { NewUser } from '../../db/schema/users';
import { createAccessToken, createToken, verifyToken } from '../../utils/jwt.utils';
import { compare, encrypt } from '../../utils/encrypt.utils';
import { AuthenticationRepository } from './authentication.repository';
import { WrongCredentialsException } from '../../exceptions/unauthorized.exception';
import { UserEmailAlreadyExistsException } from '../../exceptions/bad-request.exception';

export class AuthService {
  private readonly repository: AuthenticationRepository;

  constructor() {
    this.repository = new AuthenticationRepository();
  }

  // * Register
  register = async (user: NewUser) => {
    try {
      const existedUser = await this.repository.getUser(user.email);

      if (!_.isEmpty(existedUser)) {
        throw new UserEmailAlreadyExistsException(user.email);
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
      const user = await this.repository.getUser(email);

      if (_.isEmpty(user)) {
        throw new WrongCredentialsException();
      }

      const { password: encryptedPassword } = user[0];

      const isPasswordMatched = await compare(password, encryptedPassword);

      if (!isPasswordMatched) {
        throw new WrongCredentialsException();
      }

      return createToken(user[0]);
    } catch (error) {
      throw error;
    }
  };

  // * refresh token
  generateAccessToken = async (refreshToken: string) => {
    try {
      const decoded = verifyToken(refreshToken);

      // * if refresh token is valid
      // * if not valid, it will throw error from jwt.verify() method.
      return {
        token: createAccessToken(decoded),
      };
    } catch (error) {
      throw error;
    }
  };
}
