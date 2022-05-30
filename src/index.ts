import express from "express"
import pino from "pino"
import express_pino from "express-pino-logger"
import body_parser from "body-parser"
import passport from "passport"
import fake from "./infrastructure/auth/fake"
const app = express()
passport.use(fake())
app.use(body_parser.urlencoded({ extended: true }));
app.use(express_pino({logger: pino({level: "debug"})}))

app.get('/', async function (req, res) {
  res.send('hello world2')
})

app.listen(3000)