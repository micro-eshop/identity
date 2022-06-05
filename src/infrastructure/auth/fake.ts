import {Strategy} from 'passport-local'
import { LoginResult, LoginService } from '../../core/services/login';

export default function (loginService: LoginService) {
    return new Strategy({usernameField: "username", passwordField: "password"}, async function (username, password, done) {
        const resutlt = await loginService.login(username, password);
        return done(null, resutlt)
    })
}
