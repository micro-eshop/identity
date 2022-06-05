
export interface UserReader {
    findUser(username: string): Promise<User | null>;
}

export interface CreateUser {
    readonly username: string;
    readonly password: string;
    readonly email?: string;
}

export interface UserWriter {
    createUser(user: CreateUser): Promise<User>;
}