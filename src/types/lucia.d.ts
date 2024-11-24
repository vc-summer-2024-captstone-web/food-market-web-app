import type { UserAttributes } from "lucia";

declare module 'lucia' {
  interface User extends RegisteredDatabaseUserAttributes {
    id: UserId;
    verified: boolean;
  }
}