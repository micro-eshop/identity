import express, { Application } from "express"
import pino from "pino"
import express_pino from "express-pino-logger"
import body_parser from "body-parser"
import passport from "passport"
import fake from "../infrastructure/auth/fake"
import jwt from 'jsonwebtoken';

export default async function () : Promise<Application> {
    // const { Sequelize } = require('@sequelize/core');
    // const sequelize = new Sequelize({ dialect: 'sqlite' });
    
    // await sequelize.authenticate();
    const app = express()
    passport.use("login", fake())
    app.use(body_parser.urlencoded({ extended: true }));
    app.use(body_parser.json());
    app.use(express_pino({logger: pino({level: "debug"})}))
    
    function errorHandler (err: any, req: any, res: any, next: any) {
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
          async (err, user, info) => {
            try {
              if (err || !user) {
                res.statusCode = 400;
                res.json({ error: 'Invalid username or password' });
                return;
              }
    
              req.login(
                user,
                { session: false },
                async (error) => {
                  if (error) return next(error);
                  const body = { _id: user._id, email: user.email };
                  const token = jwt.sign({ user: body }, 'TOP_SECRET');
    
                  return res.json({ token });
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