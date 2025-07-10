declare module 'passport-local' {
  import { Strategy as PassportStrategy } from 'passport';

  export class Strategy extends PassportStrategy {
    constructor(
      options?: {
        usernameField?: string;
        passwordField?: string;
        session?: boolean;
        passReqToCallback?: false;
      },
      verify?: (username: string, password: string, done: (error: any, user?: any, options?: { message: string }) => void) => void,
    );
  }
} 