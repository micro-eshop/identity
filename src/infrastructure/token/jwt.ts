import jwt from 'jsonwebtoken';
import { TokenGenerator } from '../../core/services/token';

export class JwtTokenGenerator implements TokenGenerator {
    
    constructor(private secret: string) {
    }

    async generate({ userId, username}: { username: string, userId: string}): Promise<string> {
        return jwt.sign({ username: username, sub: userId }, this.secret, { expiresIn: '2h', algorithm: "HS512", });
    }

}