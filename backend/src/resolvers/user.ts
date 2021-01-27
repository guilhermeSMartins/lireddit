import { MyContext } from '../types';
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { User } from '../entities/User';
import { hash, verify } from 'argon2';
import { EntityManager } from '@mikro-orm/postgresql';
import { COOKIE_NAME } from '../constants';
import { UsernamePasswordInput } from './UsernamePasswordInput';
import { validateUser } from '../utils/validateRegister';
import sendEmail from 'src/utils/sendEmail';
@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string, @Ctx() { em }: MyContext) {
    const user = await em.findOne(User, { email });

    if(!user) {
      //the email is not in the db
      return true;
    }

    const token = 'qwfqwdqd22d11';

    await sendEmail(
      email, 
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`  
    );

    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    //not logged in
    if (!req.session.userId) return null;

    const user = await em.findOne(User, { id: req.session.userId });

    return user;
  }
  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext,
  ): Promise<UserResponse> {
    console.log(options);
    const errors = validateUser(options);

    if (errors) {
      return { errors };
    }

    const { password, username, email } = options;

    const hashedPassword = await hash(password);
    let user;
    try {
      //const result = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert({ username, password: hashedPassword, email, created_at: new Date(), updated_at: new Date(),}).returning('*');
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: username,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning('*');

      user = result[0];
    } catch (err) {
      if (err.code == '23505' || err.detail.includes('already exists'))
        //duplicate username
        return {
          errors: [
            {
              field: 'usernameOrEmail',
              message: 'username already taken',
            },
          ],
        };
    }

    //store user id session
    //this will set a cookie on the user
    //keep them logged in
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { em, req }: MyContext,
  ): Promise<UserResponse> {
    const user = await em.findOne(
      User,
      usernameOrEmail.includes('@')
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail },
    );

    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: "username doesn't exist",
          },
        ],
      };
    }

    const valid = await verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'password incorrect',
          },
        ],
      };
    }

    req.session.userId = user.id;
    req.session.randomKey = 'mitaka is fucking awesome';

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err: any) => {
        res.clearCookie(COOKIE_NAME);
        if (err) return resolve(false);

        return resolve(true);
      }),
    );
  }
}
