import { Box, useColorMode } from "@chakra-ui/react";
import React from "react";

import SignInFormComponent from "../../components/SignIn";

const SignInPage = () => {
    const { colorMode } = useColorMode();

    return (
        <Box
            bg={colorMode === "light" ? "gray.200" : "gray.600"}
            w="350px"
            p={3}
            boxShadow="sm"
            rounded="lg"
        >
            <SignInFormComponent />
        </Box>
    );
};

export default SignInPage;
