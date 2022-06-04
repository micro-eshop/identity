export interface SuccessLoginResult {
    kind: 'success';
    username: string;
    token: string;
    sessionId: string;
    userid: string;
}

export interface UserNotFoundResult {
    kind: 'user-not-found';
}

export interface IncorrectPasswordResult {
    kind: 'incorrect-password';
}

export type LoginResult = SuccessLoginResult | UserNotFoundResult | IncorrectPasswordResult;

export function login(findUser: (username: string) => Promise<User | null>, hashPassword: (password: string, salt: string) => Promise<string>, generateToken: (user: User) => Promise<string>) {
    return async (username: string, password: string): Promise<LoginResult>  => {
        const user = await findUser(username);
        if (user === null) {
            return { kind: 'user-not-found' };
        }
        const hash = await hashPassword(password, user.salt);
        if (hash !== user.password) {
            return { kind: 'incorrect-password' };
        }
        const token = await generateToken(user);
        return { kind: 'success', username: user.username, token: token, sessionId: '', userid: user.userId };
    }
}