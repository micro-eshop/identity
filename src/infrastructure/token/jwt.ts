import jwt from 'jsonwebtoken';
import { TokenGenerator } from '../../core/services/token';

export class JwtTokenGenerator implements TokenGenerator {
    
    constructor(private secret: string) {
    }

    async generate(usr: User): Promise<string> {
        return jwt.sign({ _id: usr.userId, username: usr.username }, this.secret, { expiresIn: '2h' });
    }

}