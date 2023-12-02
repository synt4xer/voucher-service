import HttpException from './http.exception';

export class WrongCredentialsException extends HttpException {
  constructor() {
    super(401, 'Wrong credentials provided');
  }
}

export class AuthTokenMissingException extends HttpException {
  constructor() {
    super(401, 'Authorization token missing');
  }
}

export class WrongAuthTokenException extends HttpException {
  constructor() {
    super(401, 'Wrong authentication token');
  }
}

export class WrongResTokenException extends HttpException {
  constructor() {
    super(401, 'Wrong refresh token');
  }
}
