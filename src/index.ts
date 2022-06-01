import express from "express"
import pino from "pino"
import express_pino from "express-pino-logger"
import body_parser from "body-parser"
import passport from "passport"
import fake from "./infrastructure/auth/fake"
import jwt from 'jsonwebtoken';

const app = express()
passport.use(fake())
app.use(body_parser.urlencoded({ extended: true }));
app.use(express_pino({logger: pino({level: "debug"})}))

app.post(
  '/login',
  async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err, user, info) => {
        try {
          if (err || !user) {
            const error = new Error('An error occurred.');

            return next(error);
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

app.listen(3000)