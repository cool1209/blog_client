import React, { useRef, useContext } from "react";
import {
    InputGroup,
    Input,
    InputLeftElement,
    Button,
    Stack,
    FormControl,
    Box,
    useColorMode,
    useToast,
} from "@chakra-ui/react";
import { InfoIcon, EmailIcon, LockIcon } from "@chakra-ui/icons";
import AuthenticatedUser from "../../models/AuthUser";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import ApiError from "../../models/ApiError";
import { SERVER_API_URL } from "../../config";
import { PATH } from "../../consts";

const SignUpFormComponent = () => {
    const API_URL = process.env.REACT_APP_BLOG_API_URL || SERVER_API_URL;
    const { colorMode } = useColorMode();
    const authContext = useContext(AuthContext);
    const toast = useToast();
    const history = useHistory();
    const usernameRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const emailRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const passwordRef = useRef() as React.MutableRefObject<HTMLInputElement>;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                body: JSON.stringify({
                    username: usernameRef.current.value,
                    email: emailRef.current.value,
                    password: passwordRef.current.value,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                const responseData: ApiError = await response.json();
                throw new Error(responseData.message || response.statusText);
            }
            const responseData: AuthenticatedUser = await response.json();
            const expirationTime = new Date(
                new Date().getTime() + responseData.expirationTime * 1000
            );
            authContext.signin(
                responseData.token,
                expirationTime.toISOString()
            );
            history.push(PATH.HOME);
        } catch (error) {
            toast({
                title: `${error}`,
                status: "error",
                isClosable: true,
                duration: 3000,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
                <FormControl isRequired>
                    <InputGroup>
                        <InputLeftElement children={<InfoIcon />} />
                        <Input
                            type="text"
                            placeholder="User name"
                            aria-label="User name"
                            ref={usernameRef}
                            bg={colorMode === "light" ? "white" : "inherit"}
                        />
                    </InputGroup>
                </FormControl>
                <FormControl isRequired>
                    <InputGroup>
                        <InputLeftElement children={<EmailIcon />} />
                        <Input
                            type="email"
                            placeholder="Email"
                            aria-label="Email"
                            ref={emailRef}
                            bg={colorMode === "light" ? "white" : "inherit"}
                        />
                    </InputGroup>
                </FormControl>
                <FormControl isRequired>
                    <InputGroup>
                        <InputLeftElement children={<LockIcon />} />
                        <Input
                            type="password"
                            placeholder="Password"
                            aria-label="Password"
                            ref={passwordRef}
                            bg={colorMode === "light" ? "white" : "inherit"}
                        />
                    </InputGroup>
                </FormControl>
                <Box textAlign="center">
                    <Button
                        type="submit"
                        boxShadow="sm"
                        _hover={{ boxShadow: "md" }}
                        _active={{ boxShadow: "lg" }}
                    >
                        Sign up!
                    </Button>
                </Box>
            </Stack>
        </form>
    );
};

export default SignUpFormComponent;
