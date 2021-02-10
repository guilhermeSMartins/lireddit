import NavBar from "../components/NavBar";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from '../generated/graphql';
import { Layout } from "../components/Layout";
import React from "react";
import NextLink from 'next/link';
import { Link } from "@chakra-ui/react";
import { useIsAuth } from "../utils/useIsAuth";

const Index = () => {
  const [{ data }] = usePostsQuery();
  useIsAuth();
  return (
    <Layout>
      <NextLink href='/create-post'>
        <Link>
          create post
        </Link>
      </NextLink>
      <br />
      <h1>Hello WOrld</h1>  
      { !data ? 
        (<div>loadgin...</div>) : 
        (data.posts.map(p => <div key={p.id}>{p.title}</div>)) }
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
