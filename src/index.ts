import express from "express"
import pino from "pino"
import express_pino from "express-pino-logger"

const app = express()

app.use(express_pino({logger: pino({level: "debug"})}))

app.get('/', async function (req, res) {
  res.send('hello world2')
})

app.listen(3000)