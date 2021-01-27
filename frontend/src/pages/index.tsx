import NavBar from "../components/NavBar";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from '../generated/graphql';

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <>
      <NavBar />
      <h1>Hello WOrld</h1>  
      { !data ? 
        (<div>loadgin...</div>) : 
        (data.posts.map(p => <div key={p.id}>{p.title}</div>)) }
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
