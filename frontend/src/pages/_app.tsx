import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import { cacheExchange, QueryInput, Cache } from '@urql/exchange-graphcache';
import { Provider, createClient, dedupExchange, fetchExchange } from 'urql';
import { LoginMutation, MeDocument, MeQuery, Query, RegisterMutation } from '../generated/graphql';
import theme from '../theme';

function betterUpdateQuery<Result, Query> (
  cache: Cache, 
  qi: QueryInput, 
  result: any, 
  fn: (r: any, q: Query) => Query) {
    return cache.updateQuery(qi, data => fn(result, data as any) as any);
}

const client = createClient({ 
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include', //send a cookie
  },
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
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
  }}), fetchExchange]
});

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    </Provider>
  )
}

export default MyApp
