import { UserReader } from "../repository/user";
import { TokenGenerator } from "./token";

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

export class LoginService {
    constructor(private readonly userReader: UserReader, private readonly tokenGenerator: TokenGenerator, private readonly hashPassword: (password: string, salt: string) => Promise<string>) { }
    
    async login(username: string, password: string): Promise<LoginResult> {
        const user = await this.userReader.findUser(username);
        if (user === null) {
            return { kind: 'user-not-found' };
        }
        const hash = await this.hashPassword(password, user.salt);
        if (hash !== user.password) {
            return { kind: 'incorrect-password' };
        }
        const token = await this.tokenGenerator.generate(user);
        return { kind: 'success', username: user.username, token: token, sessionId: '', userid: user.userId };
    }
}