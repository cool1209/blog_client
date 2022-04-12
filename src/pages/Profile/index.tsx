// node_modules
import React, { useRef, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    InputGroup,
    Input,
    InputLeftElement,
    Button,
    Stack,
    FormControl,
    Box,
    FormErrorMessage,
    Image,
    useColorMode,
    useToast,
} from "@chakra-ui/react";
import { InfoIcon, EmailIcon, LockIcon } from "@chakra-ui/icons";

// components
import ImageUploadComponent from "../../components/ImageUpload";

// store
import { fetchMe } from "../../store/me-slice";
import { RootState } from "../../store";

// slices
import AuthContext from "../../store/auth-context";

// models
import ApiError from "../../models/ApiError";

// config
import { SERVER_API_URL, BASE_SERVER_API_URL } from "../../config";

// consts
import { PATH } from "../../consts";

const ProfilePage = () => {
    const API_URL = process.env.REACT_APP_BLOG_API_URL || SERVER_API_URL;

    const dispatch = useDispatch();
    const { colorMode } = useColorMode();
    const authContext = useContext(AuthContext);
    const toast = useToast();
    const history = useHistory();

    const usernameRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const emailRef = useRef() as React.MutableRefObject<HTMLInputElement>;

    const me = useSelector((state: RootState) => state.me.me);
    const [userData, setUserData] = useState(authContext.userData);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [imageUrl, setImageUrl] = useState(me.photoUrl);

    const [oldPasswordError, setOldPasswordError] = useState(true);
    const [newPasswordError, setNewPasswordError] = useState(true);
    const [confirmPasswordError, setConfirmPasswordError] = useState(true);

    useEffect(() => {
        setOldPasswordError(newPassword && !oldPassword ? true : false);
        setNewPasswordError(oldPassword && !newPassword ? true : false);
        setConfirmPasswordError(newPassword !== confirmPassword ? true : false);
    }, [oldPassword, newPassword, confirmPassword]);

    useEffect(() => {
        setUserData(me);
    }, [me]);

    const fieldChange = (field: string, value: string) => {
        setUserData({
            ...userData,
            [field]: value,
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch(`${API_URL}/users/user`, {
                method: "PUT",
                body: JSON.stringify({
                    username: usernameRef.current.value,
                    oldPassword: oldPassword,
                    password: newPassword,
                    photoUrl: imageUrl,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) {
                const responseData: ApiError = await response.json();
                throw new Error(responseData.message || response.statusText);
            }
            dispatch(fetchMe(authContext.token));
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
            <Stack spacing={3} mt={"8px"}>
                <FormControl isRequired>
                    <InputGroup>
                        <InputLeftElement children={<InfoIcon />} />
                        <Input
                            type="text"
                            placeholder="User name"
                            aria-label="User name"
                            onChange={(event) =>
                                fieldChange("username", event.target.value)
                            }
                            value={userData.username}
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
                            onChange={(event) =>
                                fieldChange("email", event.target.value)
                            }
                            value={userData.email}
                            ref={emailRef}
                            bg={colorMode === "light" ? "white" : "inherit"}
                            disabled
                        />
                    </InputGroup>
                </FormControl>
                <FormControl isInvalid={oldPasswordError}>
                    <InputGroup>
                        <InputLeftElement children={<LockIcon />} />
                        <Input
                            type="password"
                            placeholder="Old Password"
                            aria-label="Old Password"
                            onChange={(event) =>
                                setOldPassword(event.target.value)
                            }
                            bg={colorMode === "light" ? "white" : "inherit"}
                        />
                    </InputGroup>
                    {oldPasswordError && (
                        <FormErrorMessage>
                            Please input old password!
                        </FormErrorMessage>
                    )}
                </FormControl>
                <FormControl isInvalid={newPasswordError}>
                    <InputGroup>
                        <InputLeftElement children={<LockIcon />} />
                        <Input
                            type="password"
                            placeholder="New Password"
                            aria-label="New Password"
                            onChange={(event) =>
                                setNewPassword(event.target.value)
                            }
                            bg={colorMode === "light" ? "white" : "inherit"}
                        />
                    </InputGroup>
                    {newPasswordError && (
                        <FormErrorMessage>
                            Please input new password!
                        </FormErrorMessage>
                    )}
                </FormControl>
                <FormControl isInvalid={confirmPasswordError}>
                    <InputGroup>
                        <InputLeftElement children={<LockIcon />} />
                        <Input
                            type="password"
                            placeholder="Confirm Password"
                            aria-label="Confirm Password"
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                            bg={colorMode === "light" ? "white" : "inherit"}
                        />
                    </InputGroup>
                    {confirmPasswordError && (
                        <FormErrorMessage>
                            Please input same password!
                        </FormErrorMessage>
                    )}
                </FormControl>
                <FormControl>
                    <InputGroup>
                        <ImageUploadComponent
                            setData={(uploadedImageUrl: string) => {
                                setImageUrl(uploadedImageUrl);
                            }}
                        />
                    </InputGroup>
                    {imageUrl && (
                        <Image
                            width={"100%"}
                            height={"300px"}
                            src={`${BASE_SERVER_API_URL}${imageUrl}`}
                        />
                    )}
                </FormControl>
                <Box textAlign="center" mb={"8px"}>
                    <Button
                        type="submit"
                        boxShadow="sm"
                        _hover={{ boxShadow: "md" }}
                        _active={{ boxShadow: "lg" }}
                    >
                        Save!
                    </Button>
                </Box>
            </Stack>
        </form>
    );
};

export default ProfilePage;
