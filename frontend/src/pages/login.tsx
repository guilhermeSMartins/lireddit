import React from 'react'
import { Formik, Form } from 'formik';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';

interface registerProps {}
   
const Login: React.FC<registerProps> = ({}) => {
    const router = useRouter()
    const [, login] = useLoginMutation();
    return (
        <Wrapper variant='small'>
            <Formik 
                onSubmit={(async (values, { setErrors }) => {
                    const response = await login(values);

                    if(response.data?.login.errors) 
                        setErrors(toErrorMap(response.data?.login.errors))
                    else if(response.data?.login.user) {
                        //worked
                        router.push('/');
                    }
                })}
                initialValues={{ usernameOrEmail: '', password: '' }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField 
                            name='usernameOrEmail' 
                            placeholder='username or email' 
                            label='Username or Email' 
                        />
                        <Box mt={4} />
                        <InputField 
                            name='password' 
                            placeholder='password' 
                            label='Password' 
                            type='password' 
                        />
                        <Flex mt={2}>
                            <Box ml='auto'>
                                <NextLink href='/forgot-password'>
                                    <Link ml='auto'>forgot password?</Link>
                                </NextLink>
                            </Box>
                        </Flex>
                        <Button 
                            mt={4} 
                            type='submit' 
                            isLoading={isSubmitting} 
                            backgroundColor='darkgreen'
                            color='whitesmoke'
                        >login</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(Login);