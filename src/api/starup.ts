import express, { Application } from "express"
import pino from "pino"
import express_pino from "express-pino-logger"
import body_parser from "body-parser"
import passport from "passport"
import strategy from "../infrastructure/auth/fake"
import { connect, PostgresUserReader, PostgresUserWriter, seed } from "../infrastructure/auth/postgres"
import { LoginService } from "../core/services/login"
import loginhandler from "../routers/login"
import { Sequelize } from "@sequelize/core/types"
import { genSalt, hashPassword } from "../infrastructure/auth/password"
import {JwtTokenGenerator} from "../infrastructure/token/jwt"
import { Strategy } from "passport-local"

export interface AuthApi {
    app: Application
    sequelize: Sequelize
    logger: pino.Logger
}

function createloginStrategy(sq: Sequelize) : Strategy {
    const repo = new PostgresUserReader(sq)
    const token = new JwtTokenGenerator(process.env.SECRET_KET ?? "jp2gmd2137")
    const service = new LoginService(repo, token, hashPassword) 
    return strategy(service)
}

export default async function (): Promise<AuthApi> {
    const logger = pino({ level: process.env.NODE_ENV === "production" ? "warn" : "debug" });
    const postgresConnection = await connect(process.env.POSTGRES_CONN ?? 'postgres://postgres:postgres@db:5432/postgres', logger)
    const reader = new PostgresUserReader(postgresConnection)
    const writer = new PostgresUserWriter(postgresConnection, genSalt, hashPassword)
    await seed(reader, writer)
    const app = express()
    passport.use("login", createloginStrategy(postgresConnection))
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

    return { app: app, sequelize: postgresConnection, logger: logger };
}