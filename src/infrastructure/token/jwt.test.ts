import { JwtTokenGenerator } from "./jwt";

test("test token generation", () => {
    const tokenGenerator = new JwtTokenGenerator("secret");
    const user = { username: "test", userId: "test" };
    const token = tokenGenerator.generate(user);
    expect(token).toBeDefined();
});