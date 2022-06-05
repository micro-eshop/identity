import express, { Application } from "express"
import pino from "pino"
import express_pino from "express-pino-logger"
import body_parser from "body-parser"
import passport from "passport"
import fake from "../infrastructure/auth/fake"
import { connect, findUserByUsername, seed } from "../infrastructure/auth/postgres"
import { login, LoginResult } from "../core/services/login"
import loginhandler from "../routers/login"
import { Sequelize } from "@sequelize/core/types"
import { hashPassword } from "../infrastructure/auth/password"
import jwt from "../infrastructure/token/jwt"
import { Strategy } from "passport-local"

function createloginStrategy() : Strategy {
    return fake(login(findUserByUsername, hashPassword, jwt(process.env.SECRET_KET ?? "jp2gmd2137")))
}

export default async function (): Promise<Application> {
    const postgresConnection = await connect(process.env.POSTGRES_CONN ?? 'postgres://postgres:postgres@db:5432/postgres')
    seed(postgresConnection)
    const app = express()
    passport.use("login", createloginStrategy())
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
    loginhandler({ app })

    return app;
}