import express, { Application } from "express"
import pino from "pino"
import express_pino from "express-pino-logger"
import body_parser from "body-parser"
import passport from "passport"
import fake from "../infrastructure/auth/fake"
import jwt from 'jsonwebtoken';
import { connect, seed } from "../infrastructure/auth/postgres"
import { LoginResult } from "../core/services/login"

export default async function (): Promise<Application> {
    const postgresConnection = await connect(process.env.POSTGRES_CONN ?? 'postgres://postgres:postgres@db:5432/postgres')
    seed(postgresConnection)
    const app = express()
    passport.use("login", fake())
    app.use(body_parser.urlencoded({ extended: true }));
    app.use(body_parser.json());
    app.use(express_pino({ logger: pino({ level: "debug" }) }))

    function errorHandler(err: any, req: any, res: any, next: any) {
        if (res.headersSent) {
            return next(err)
        }
        res.status(500)
        res.render('error', { error: err })
    }
    app.use(errorHandler)
    app.post(
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

    return app;
}