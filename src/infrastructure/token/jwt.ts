import jwt from 'jsonwebtoken';

export default function(secret: string) {
    return async function(usr: User): Promise<string> {
        return jwt.sign({ _id: usr.userId, username: usr.username }, secret, { expiresIn: '2h' });
    }
}