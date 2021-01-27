import { cacheExchange } from '@urql/exchange-graphcache';
import { dedupExchange, fetchExchange } from 'urql';
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, Query, RegisterMutation } from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';

export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const, //send a cookie
  },
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        logout: (result, args, cache, info) => {
          betterUpdateQuery<LogoutMutation, MeQuery>(
            cache,
            { query: MeDocument },
            result,
            () => ({ me: null })
          )
        },
        login: (result, args, cache, info) => {
          betterUpdateQuery<LoginMutation, MeQuery>(
            cache,
            { query: MeDocument },
            result,
            (result, query) => {
              if(result.login.errors) return query;
              return { me: result.login.user };
            }
          )
      },
      register: (result, args, cache, info) => {
        betterUpdateQuery<RegisterMutation, MeQuery>(
          cache,
          { query: MeDocument },
          result,
          (result, query) => {
            if(result.register.errors) return query;
            return { me: result.register.user };
          }
        )
    }

    }
  }}), ssrExchange, fetchExchange]

});