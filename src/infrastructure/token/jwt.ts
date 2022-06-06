import jwt from 'jsonwebtoken';
import { TokenGenerator } from '../../core/services/token';

export class JwtTokenGenerator implements TokenGenerator {
    
    constructor(private secret: string) {
    }

    generate({ userId, username}: { username: string, userId: string}): string {
        return jwt.sign({ username: username, sub: userId }, this.secret, { expiresIn: '2h', algorithm: "HS512", });
    }

}