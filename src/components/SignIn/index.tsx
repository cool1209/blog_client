// node_modules
import React, { useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { GoogleLoginButton } from "ts-react-google-login-component";
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

// context
import AuthContext from "../../store/auth-context";

// slices
import { fetchSigninGoogle } from "../../store/me-slice";

// config
import { SERVER_API_URL } from "../../config";

// consts
import { PATH } from "../../consts";

// models
import AuthenticatedUser from "../../models/AuthUser";
import ApiError from "../../models/ApiError";

const SignInFormComponent = () => {
    const API_URL = process.env.REACT_APP_BLOG_API_URL || SERVER_API_URL;
    const clientConfig = {
        client_id: `958035201784-f1otga6aorensm9hqh06abs5fc7nm8v1.apps.googleusercontent.com`,
    };

    const authContext = useContext(AuthContext);

    const dispatch = useDispatch();
    const history = useHistory();
    const toast = useToast();
    const { colorMode } = useColorMode();

    const emailRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const passwordRef = useRef() as React.MutableRefObject<HTMLInputElement>;

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

    const responseGoogle = (googleUser: gapi.auth2.GoogleUser): void => {
        const profile = googleUser.getBasicProfile();

        const email = profile.getEmail();
        const google = profile.getId();

        dispatch(
            fetchSigninGoogle(
                email,
                google,
                (response: { token: string; expirationTime: string }) => {
                    authContext.signin(response.token, response.expirationTime);
                    history.push(PATH.HOME);
                },
                (error: string) => {
                    toast({
                        title: `${error}`,
                        status: "error",
                        isClosable: true,
                        duration: 3000,
                    });
                }
            )
        );
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
