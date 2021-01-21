import React from 'react'
import { Formik, Form } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';

interface registerProps {}
   
const Login: React.FC<registerProps> = ({}) => {
    const router = useRouter()
    const [, login] = useLoginMutation();
    return (
        <Wrapper variant='small'>
            <Formik 
                onSubmit={(async (values, { setErrors }) => {
                    const response = await login({ options: values });

                    if(response.data?.login.errors) 
                        setErrors(toErrorMap(response.data?.login.errors))
                    else if(response.data?.login.user) {
                        //worked
                        router.push('/');
                    }
                })}
                initialValues={{username: '', password: ''}}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField 
                            name='username' 
                            placeholder='username' 
                            label='Username' 
                        />
                        <Box mt={4} />
                        <InputField 
                            name='password' 
                            placeholder='password' 
                            label='Password' 
                            type='password' 
                        />
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

export default Login;