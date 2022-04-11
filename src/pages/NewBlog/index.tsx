// node_modules
import React, { useRef, useContext } from "react";
import {
    Input,
    Button,
    Stack,
    FormControl,
    useColorMode,
    Box,
    useToast,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

// config
import { SERVER_API_URL } from "../../config";

// consts
import { PATH } from "../../consts";

// models
import AuthenticatedUser from "../../models/AuthUser";
import ApiError from "../../models/ApiError";

const NewBlogPage = () => {
    const API_URL = process.env.REACT_APP_BLOG_API_URL || SERVER_API_URL;
    const { colorMode } = useColorMode();
    const history = useHistory();
    const toast = useToast();
    const titleRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const textRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>;
    const imageRef = useRef() as React.MutableRefObject<HTMLInputElement>;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch(`${API_URL}/blogs/blog`, {
                method: "POST",
                body: JSON.stringify({
                    title: titleRef.current.value,
                    text: textRef.current.value,
                }),
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                const responseData: ApiError = await response.json();
                throw new Error(responseData.message || response.statusText);
            }
            const responseData: {
                message: string;
            } = await response.json();
            toast({
                title: `${responseData.message}`,
                status: "info",
                isClosable: true,
                duration: 3000,
            });
            history.push(PATH.BLOGS);
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
                    <Text mb="8px">Title:</Text>
                    <Input
                        type="title"
                        placeholder="Title"
                        aria-label="Title"
                        bg={colorMode === "light" ? "white" : "inherit"}
                        ref={titleRef}
                    />
                </FormControl>
                <FormControl isRequired>
                    <Text mb="8px">Text:</Text>
                    <Textarea
                        placeholder="Text"
                        aria-label="Text"
                        bg={colorMode === "light" ? "white" : "inherit"}
                        resize={"none"}
                        ref={textRef}
                    />
                </FormControl>
                <FormControl>
                    <Text mb="8px">Image:</Text>
                    <Input
                        type="file"
                        placeholder="Image"
                        aria-label="Image"
                        bg={colorMode === "light" ? "white" : "inherit"}
                        ref={imageRef}
                    />
                </FormControl>
                <Box textAlign="center">
                    <Button
                        type="submit"
                        boxShadow="sm"
                        _hover={{ boxShadow: "md" }}
                        _active={{ boxShadow: "lg" }}
                    >
                        Save your Blog!
                    </Button>
                </Box>
            </Stack>
        </form>
    );
};

export default NewBlogPage;
