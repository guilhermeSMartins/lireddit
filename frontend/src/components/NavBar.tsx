import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react'
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavBarProps {
    
}

const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    const [{ data, fetching }] = useMeQuery({
        pause: isServer(),
    });
    let body = null;

    //data is loading
    if(fetching) { 
        body = null;
    }
    //user not logged in
    else if(!data?.me) {
        body = (
            <>
                <NextLink href='/login'>
                    <Link color='white' mr={2}>login</Link>
                </NextLink>
                <NextLink href='/register'>
                    <Link color='white'>register</Link>
                </NextLink>
            </>
        );
    }
    //user is logged in
    else {
        body = (
            <Flex>
                <Box mr={2}>{data.me.username}</Box>
                <Button isLoading={logoutFetching} onClick={() => logout()} variant='link'>logout</Button>
            </Flex>
        );
    }
    return (
        <Flex zIndex={1} bg='tan' p={4} position='sticky' top={0}>
            <Box ml={'auto'}>
                { body }
            </Box>
        </Flex>
    );
}

export default NavBar;