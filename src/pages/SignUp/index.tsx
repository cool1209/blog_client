// node_modules
import React from "react";
import { Box, useColorMode } from "@chakra-ui/react";

// components
import SignUpFormComponent from "../../components/SignUp";

const SignUpPage = () => {
    const { colorMode } = useColorMode();

    return (
        <Box
            bg={colorMode === "light" ? "gray.200" : "gray.600"}
            w="350px"
            p={3}
            boxShadow="sm"
            rounded="lg"
        >
            <SignUpFormComponent />
        </Box>
    );
};

export default SignUpPage;
