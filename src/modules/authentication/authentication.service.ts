import _ from 'lodash';
import redisUtil from '../../utils/redis.util';
import { NewUser } from '../../db/schema/users';
import { AppConstant } from '../../utils/app-constant';
import { compare, encrypt } from '../../utils/encrypt.util';
import { AuthenticationRepository } from './authentication.repository';
import { createToken, verifyToken, createJwtToken } from '../../utils/jwt.util';
import {
  WrongCredentialsException,
  WrongResTokenException,
} from '../../exceptions/unauthorized.exception';
import { UserEmailAlreadyExistsException } from '../../exceptions/bad-request.exception';

const OneMinuteInSeconds = 60;

const expiresIn = AppConstant.JWT_EXPIRED_TIME * OneMinuteInSeconds;
const refreshExpiresIn = 2 * 24 * 60 * OneMinuteInSeconds; // * 2 days

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
      await this.repository.createUser({ ...user, password: hashedPwd, role: 'member' });
    } catch (error) {
      throw error;
    }
  };

  // * Login
  login = async (email: string, password: string, apiKey: string) => {
    try {
      const user = await this.repository.getUser(email);

      if (_.isEmpty(user)) {
        throw new WrongCredentialsException();
      }

      const role = user[0].role;
      const isAdmin = apiKey === AppConstant.WEB_API_KEY && role == 'admin';
      const isMember = apiKey === AppConstant.MOBILE_API_KEY && role == 'member';

      if (!isAdmin && !isMember) {
        throw new WrongCredentialsException();
      }

      const { uuid, password: encryptedPassword } = user[0];

      const isPasswordMatched = await compare(password, encryptedPassword);

      if (!isPasswordMatched) {
        throw new WrongCredentialsException();
      }

      const { token, refreshToken } = createToken(user[0]);

      await Promise.all([
        redisUtil.setValue(`${AppConstant.REDIS_AUTH_KEY}${token}`, uuid, expiresIn),
        redisUtil.setValue(`${AppConstant.REDIS_RES_KEY}${refreshToken}`, uuid, refreshExpiresIn),
      ]);

      return { token, refreshToken };
    } catch (error) {
      throw error;
    }
  };

  // * refresh token
  generateAccessToken = async (resToken: string) => {
    try {
      const isExist = redisUtil.isExists(`${AppConstant.REDIS_RES_KEY}${resToken}`);

      if (!isExist) {
        throw new WrongResTokenException();
      }

      // * if refresh token is valid
      // * if not valid, it will throw error from jwt.verify() method.
      const { _uuid, role } = verifyToken(resToken);

      const [token, refreshToken] = await Promise.all([
        createJwtToken(_uuid, role, expiresIn),
        createJwtToken(_uuid, role, refreshExpiresIn),
      ]);

      // * setup redis for new key, and delete old key
      // * old auth key expected to be expired, so we just delete the old res key
      await Promise.all([
        redisUtil.deleteValue(`${AppConstant.REDIS_RES_KEY}${resToken}`),
        redisUtil.setValue(`${AppConstant.REDIS_RES_KEY}${refreshToken}`, _uuid, refreshExpiresIn),
        redisUtil.setValue(`${AppConstant.REDIS_AUTH_KEY}${token}`, _uuid, expiresIn),
      ]);

      return {
        token,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  };

  // * logout
  logout = async (token: string, resToken: string) => {
    try {
      // * delete the key and its value from redis, so it wouldn't authorized after logout
      await Promise.all([
        redisUtil.deleteValue(`${AppConstant.REDIS_AUTH_KEY}${token}`),
        redisUtil.deleteValue(`${AppConstant.REDIS_RES_KEY}${resToken}`),
      ]);
    } catch (error) {
      throw error;
    }
  };
}
