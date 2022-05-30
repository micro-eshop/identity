import {Strategy} from 'passport-local'

export default function () {
    return new Strategy(function (username, password, done) {
        if (username === 'test' && password === 'test') {
            return done(null, { username });
        }
        return done(null, false);
    })
}