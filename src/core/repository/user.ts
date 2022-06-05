
export interface UserReader {
    findUser(username: string): Promise<User | null>;
}