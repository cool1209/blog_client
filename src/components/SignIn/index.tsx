import React, { useRef, useContext } from "react";
import {
    InputGroup,
    Input,
    InputLeftElement,
    Button,
    Stack,
    FormControl,
    useColorMode,
    Box,
    useToast,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import { GoogleLoginButton } from "ts-react-google-login-component";
import AuthenticatedUser from "../../models/AuthUser";
import AuthContext from "../../store/auth-context";
import ApiError from "../../models/ApiError";
import { SERVER_API_URL } from "../../config";
import { PATH } from "../../consts";

const SignInFormComponent = () => {
    const API_URL = process.env.REACT_APP_BLOG_API_URL || SERVER_API_URL;
    const authContext = useContext(AuthContext);
    const history = useHistory();
    const toast = useToast();
    const { colorMode } = useColorMode();
    const emailRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const passwordRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const clientConfig = {
        client_id: `958035201784-f1otga6aorensm9hqh06abs5fc7nm8v1.apps.googleusercontent.com`,
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/signin`, {
                method: "POST",
                body: JSON.stringify({
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
                expirationTime.toISOString(),
                responseData.userId
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

    const errorHandler = (error: string): void => {
        // handle error if login got failed...
        console.error(error);
    };

    const responseGoogle = (googleUser: any): void => {
        const id_token = googleUser.getAuthResponse(true).id_token;
        const googleId = googleUser.getId();

        console.log({ googleId });
        console.log({ accessToken: id_token });
        // Make user login in your system
        // login success tracking...
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
                <FormControl isRequired>
                    <InputGroup>
                        <InputLeftElement children={<EmailIcon />} />
                        <Input
                            type="email"
                            placeholder="Email"
                            aria-label="Email"
                            bg={colorMode === "light" ? "white" : "inherit"}
                            ref={emailRef}
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
                            bg={colorMode === "light" ? "white" : "inherit"}
                            ref={passwordRef}
                        />
                    </InputGroup>
                </FormControl>
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <GoogleLoginButton
                        responseHandler={responseGoogle}
                        clientConfig={clientConfig}
                        failureHandler={errorHandler}
                    />
                </Box>
                <Box textAlign="center">
                    <Button
                        type="submit"
                        boxShadow="sm"
                        _hover={{ boxShadow: "md" }}
                        _active={{ boxShadow: "lg" }}
                    >
                        Sign in!
                    </Button>
                </Box>
            </Stack>
        </form>
    );
};

export default SignInFormComponent;
