// node_modules
import React from "react";
import { Heading, Text, Image, Stack, Divider, Button } from "@chakra-ui/react";
import { ThumbUpRounded } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";

// slices
import { fetchThumbUp } from "../../store/blogs-slice";

// consts
import { PATH } from "../../consts";

// models
import Blog from "../../models/Blog";

type Props = {
    blog: Blog;
};

const BlogViewComponent: React.FC<Props> = ({ blog, ...props }) => {
    const dispatch = useDispatch();

    const onThumbUp = () => {
        dispatch(fetchThumbUp(blog.id));
    };

    return (
        <>
            <Stack
                border={"1px solid lightgray"}
                mt={"8px"}
                paddingLeft={"5px"}
                paddingRight={"5px"}
                boxShadow="sm"
                _hover={{ boxShadow: "md" }}
                cursor={"pointer"}
            >
                <Heading>{blog.title}</Heading>
                <Divider></Divider>
                <Text>{blog.text}</Text>
                <Divider></Divider>
                <Text
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                >
                    <Button onClick={onThumbUp}>
                        <ThumbUpRounded />
                    </Button>
                    &nbsp;
                    {blog.like}
                </Text>
            </Stack>
        </>
    );
};

export default BlogViewComponent;
