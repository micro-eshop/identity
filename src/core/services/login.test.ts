import { genSalt, hashPassword } from "../../infrastructure/auth/password";
import { JwtTokenGenerator } from "../../infrastructure/token/jwt";
import { UserReader } from "../repository/user";
import { LoginService, SuccessLoginResult } from "./login";

class FakeNullUserReaderStorage implements UserReader {
  constructor(private readonly users: User[] | null) { }
  async findUser(username: string): Promise<User | null> {
    if (this.users === null) {
      return null;
    }
    const res = this.users.find(user => user.username === username);
    return res === undefined ? null : res;
  }
}

test("login when user not exists, should return user not found result", async () => {
  const reader = new FakeNullUserReaderStorage(null);
  const tokenGenerator = new JwtTokenGenerator("xDDD");
  const loginService = new LoginService(reader, tokenGenerator, hashPassword);
  const result = await loginService.login("username", "password");
  expect(result).toEqual({ kind: "user-not-found" });
});

test("login when user exists and password is incorrect, should return 'incorrect-password' result", async () => {
  const salt = await genSalt();
  const password = "password";
  const reader = new FakeNullUserReaderStorage([{ username: "username", userId: "userId", password: await hashPassword(password, salt), salt, createdAt: new Date(), updatedAt: new Date() }]);
  const tokenGenerator = new JwtTokenGenerator("xDDD");
  const loginService = new LoginService(reader, tokenGenerator, hashPassword);
  const result = await loginService.login("username", "passwordz");
  expect(result).toEqual({ kind: 'incorrect-password' });
});


test("login when user exists and password is incorrect, should return correct login result", async () => {
  const salt = await genSalt();
  const password = "password";
  const reader = new FakeNullUserReaderStorage([{ username: "username", userId: "userId", password: await hashPassword(password, salt), salt, createdAt: new Date(), updatedAt: new Date() }]);
  const tokenGenerator = new JwtTokenGenerator("xDDD");
  const loginService = new LoginService(reader, tokenGenerator, hashPassword);
  const result = await loginService.login("username", "password");

  expect(result.kind).toEqual("success");
  const success = result as SuccessLoginResult;
  expect(success.username).toEqual("username");
  expect(success.token).toBeDefined();
  expect(success.sessionId).toBeDefined();
  expect(success.userid).toEqual("userId");
});