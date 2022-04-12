// node_modules
import React, { useState, useRef } from "react";
import {
    Input,
    Button,
    Stack,
    FormControl,
    useColorMode,
    Box,
    Text,
    Textarea,
    Image,
} from "@chakra-ui/react";

// models
import ApiError from "../../models/ApiError";

// config
import { BASE_SERVER_API_URL, SERVER_API_URL } from "../../config";

type Props = {
    data: {
        title: string;
        text: string;
        imageUrl: string;
    };
    setData: Function;
};

const BlogEditComponent: React.FC<Props> = ({ data, setData, ...props }) => {
    const API_URL = process.env.REACT_APP_BLOG_API_URL || SERVER_API_URL;

    const { colorMode } = useColorMode();
    const titleRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const textRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>;
    const [imageUrl, setImageUrl] = useState(data.imageUrl);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setData(titleRef.current.value, textRef.current.value, imageUrl);
    };

    const imageSelect = async (files: FileList) => {
        const formData = new FormData();
        Array.from(files).map((file) => {
            formData.append("imgCollection", file);
        });

        const response = await fetch(`${API_URL}/upload/image`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const responseData: ApiError = await response.json();
            throw new Error(responseData.message || response.statusText);
        }

        const responseData: { imageUrls: string[]; message: string } =
            await response.json();
        const uploadedImageUrl = responseData.imageUrls[0];
        setImageUrl(uploadedImageUrl);
    };

    return (
        <form onSubmit={handleSubmit} className="form-width-90">
            <Stack spacing={3}>
                <FormControl isRequired>
                    <Text mb="8px">Title:</Text>
                    <Input
                        type="title"
                        placeholder="Title"
                        aria-label="Title"
                        bg={colorMode === "light" ? "white" : "inherit"}
                        ref={titleRef}
                        defaultValue={data.title}
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
                        defaultValue={data.text}
                    />
                </FormControl>
                <FormControl>
                    <Text mb="8px">Image:</Text>
                    <Input
                        type="file"
                        placeholder="Image"
                        aria-label="Image"
                        bg={colorMode === "light" ? "white" : "inherit"}
                        // ref={imageRef}
                        onChange={(event) => {
                            imageSelect(
                                event.target.files
                                    ? event.target.files
                                    : new FileList()
                            );
                        }}
                    />
                    {imageUrl && (
                        <Image
                            width={"100%"}
                            height={"300px"}
                            src={`${BASE_SERVER_API_URL}${imageUrl}`}
                        />
                    )}
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

export default BlogEditComponent;
