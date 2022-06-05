import {Strategy} from 'passport-local'
import { LoginResult } from '../../core/services/login';

export default function (loginUser: (username: string, password: string) => Promise<LoginResult>) {
    return new Strategy({usernameField: "username", passwordField: "password"}, async function (username, password, done) {
        const resutlt = await loginUser(username, password)
        return done(null, resutlt)
    })
}