import { fastify } from "fastify";
import pino from 'pino';

// Require the framework and instantiate it
const server = fastify({
    logger: pino({ level: 'info' })
})

// Declare a route
server.get('/', async (request, reply) => {
  return { hello: 'world' }
})

// Run the server!
const start = async () => {
  try {
    await server.listen(3000)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()