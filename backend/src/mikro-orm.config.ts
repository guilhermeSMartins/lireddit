import { __prod__ } from './constants';
import { Post } from './entities/Post';
import { MikroORM } from '@mikro-orm/core';
import { join } from 'path';
import { User } from './entities/User';

export default {
  migrations: {
    path: join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: 'lireddit',
  user: 'postgres',
  password: 'docker',
  type: 'postgresql',
  host: 'localhost',
  port: 5433,
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
