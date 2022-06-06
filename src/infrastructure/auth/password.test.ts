import { genSalt, hashPassword } from "./password";

test("gen salt test", async () => {
    const salt = await genSalt();
    expect(salt).toBeDefined();
})

test("hash password", async () => {
    const salt = await genSalt();
    const password = "password";
    const hash = await hashPassword(password, salt);
    expect(hash).toBeDefined();
    expect(hash).toEqual(await hashPassword(password, salt));
})