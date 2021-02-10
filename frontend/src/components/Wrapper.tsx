import { Box } from '@chakra-ui/react';
import React from 'react'

export type WrapperVariant = 'small' | 'regular';
interface WrapperProps {
    variant?: 'small' | 'regular'
}

export const Wrapper: React.FC<WrapperProps> = ({ children, variant= 'regular' }) => {
    return (
        <Box 
            maxW={ variant === 'regular' ? "800px" : '400px' } 
            w="100%" 
            mt={8} 
            marginX="auto">
                {children}
        </Box>
    );
}