import bcrypt from "bcrypt"

export async function genSalt() :Promise<string> {
    return bcrypt.genSalt(11)
}

export async function hashPassword(password: string, salt: string) : Promise<string> {
    return bcrypt.hash(password, salt);
}