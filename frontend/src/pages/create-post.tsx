import { Box, Flex, Link, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React, { useEffect } from 'react'
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Layout } from '../components/Layout';

interface createPostProps {
    
}

const CreatePost: React.FC<createPostProps> = ({}) => {
    const router = useRouter();
    const [, createPost] = useCreatePostMutation();
    return (
      <Layout variant='small'>
          <Formik 
                onSubmit={(async (values) => {
                    const { error } = await createPost({ input: values });

                    if(!error) {
                        router.push('/');
                    }
                })}
                initialValues={{ title: '', text: '' }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField 
                            name='title' 
                            placeholder='title' 
                            label='Title' 
                        />
                        <Box mt={4} />
                        <InputField 
                            textarea
                            name='text' 
                            placeholder='text...' 
                            label='Body' 
                        />
                        <Button 
                            mt={4} 
                            type='submit' 
                            isLoading={isSubmitting} 
                            backgroundColor='darkgreen'
                            color='whitesmoke'
                        >create Post</Button>
                    </Form>
                )}
            </Formik>
      </Layout>  
    );
}

export default withUrqlClient(createUrqlClient)(CreatePost);