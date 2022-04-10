// node_modules
import React from "react";
import { Flex, Box, Heading, Spacer, Button, Link } from "@chakra-ui/react";

// consts
import { PATH } from "../../consts";

const HeaderComponent: React.FC = () => {
    return (
        <Flex bgColor={"darkgray"} padding={"10px"}>
            <Box p="2">
                <Link href="2" textDecoration={"none"}>
                    <Heading size="md">Test Blog</Heading>
                </Link>
            </Box>
            <Spacer />
            <Box>
                <Button colorScheme="teal" mr="4">
                    <Link href={PATH.SIGNIN} textDecoration={"none"}>
                        Log in
                    </Link>
                </Button>
                <Button colorScheme="teal">
                    <Link href={PATH.SIGNUP} textDecoration={"none"}>
                        {" "}
                        Sign Up
                    </Link>
                </Button>
            </Box>
        </Flex>
    );
};

export default HeaderComponent;
