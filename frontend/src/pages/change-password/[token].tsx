import { Box, Button, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import React, { useState } from 'react'
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { toErrorMap } from '../../utils/toErrorMap';
import { useChangePasswordMutation } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import NextLink from 'next/link';

const ChangePassword: NextPage = () => {
    const router = useRouter();
    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState('');
    return (
        <Wrapper variant='small'>
        <Formik
            onSubmit={(async (values, { setErrors }) => {
                const response = await changePassword({ 
                    newPassword: values.newPassword,
                    token: 
                        typeof router.query.token === 'string' ? router.query.token : '',
                });

                if(response.data?.changePassword.errors) {
                    const errorMap = toErrorMap(response.data?.changePassword.errors);
                    
                    if('token' in errorMap) {
                        setTokenError(errorMap.token);
                    }
                    
                    setErrors(errorMap);
                }
                else if(response.data?.changePassword.user) {
                    router.push('/');
                }
            })}
            initialValues={{ newPassword: '' }}>
            {({ isSubmitting }) => (
                <Form>
                    <InputField 
                        name='newPassword' 
                        placeholder='new password' 
                        label='New Password'
                        type='password' 
                    />
                    {tokenError ? (
                        <Box>
                            <Box mr={4} style={{ color: 'red' }}>{ tokenError }</Box>
                            <NextLink href='/forgot-password'>
                                <Link>click here to get a new one</Link>
                            </NextLink>
                        </Box>
                    ) : null}
                    <Button 
                        mt={4} 
                        type='submit' 
                        isLoading={isSubmitting} 
                        variantColor='teal'
                    >change password</Button>
                </Form>
            )}
        </Formik>
    </Wrapper>

    );
}

// ChangePassword.getInitialProps = ({ query }) => {
//     return {
//         token: query.token as string,
//     };
// }

export default withUrqlClient(createUrqlClient)(ChangePassword);