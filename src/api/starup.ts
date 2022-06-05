import express, { Application } from "express"
import pino from "pino"
import express_pino from "express-pino-logger"
import body_parser from "body-parser"
import passport from "passport"
import fake from "../infrastructure/auth/fake"
import jwt from 'jsonwebtoken';
import { connect, seed } from "../infrastructure/auth/postgres"
import { LoginResult } from "../core/services/login"
import login from "../routers/login"

export default async function (): Promise<Application> {
    const postgresConnection = await connect(process.env.POSTGRES_CONN ?? 'postgres://postgres:postgres@db:5432/postgres')
    seed(postgresConnection)
    const app = express()
    passport.use("login", fake(async (username: string, password: string) => { return { kind: 'user-not-found' } }))
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
    login({ app })

    return app;
}