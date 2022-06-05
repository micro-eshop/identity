import { Application } from "express";
import passport from "passport";
import { LoginResult } from "../core/services/login";

interface CompositionRoot {
    readonly app: Application
}

export default function (root: CompositionRoot) {
    root.app.post(
        '/login',
        async (req, res, next) => {
            console.log(req.body)
            passport.authenticate(
                'login',
                async (err, user: LoginResult, info) => {
                    try {
                        if (err) {
                            res.statusCode = 500
                            res.send(err)
                            return
                        }

                        if (user.kind === 'incorrect-password' || user.kind === 'user-not-found') {
                            res.statusCode = 400;
                            res.json({ error: 'Invalid username or password' });
                            return;
                        }

                        req.login(
                            user,
                            { session: false },
                            async (error) => {
                                if (error) return next(error);
                                return res.json({ token: user.token, sessionId: user.sessionId, userid: user.userid });
                            }
                        );
                    } catch (error) {
                        return next(error);
                    }
                }
            )(req, res, next);
        }
    );

}