import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import microConfig from './mikro-orm.config';
import express, { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { COOKIE_NAME, __prod__ } from './constants';
import cors from 'cors';

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  //await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis();

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
        disableTTL: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true,
        sameSite: 'lax', //csrf
        secure: __prod__, //only works in https
      },
      saveUninitialized: false,
      secret: '8KpyPlFDwv9WrcK3BjNVxQ$1kwZAxfHwczKkbbfDNEtfsrGDKF',
      resave: false,
    }),
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: false, //'http://localhost:3000'
    },
  });

  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  });

  //const post = orm.em.create(Post, { title: 'my first post' });
  //await orm.em.persistAndFlush(post);
  //or
  //await orm.em.nativeInsert(Post, { title: 'my second post' })
};
main();
