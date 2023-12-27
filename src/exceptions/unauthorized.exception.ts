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

export class ApiKeyMissingException extends HttpException {
  constructor() {
    super(401, 'api key missing');
  }
}

export class WrongApiKeyException extends HttpException {
  constructor() {
    super(401, 'Invalid api key');
  }
}
