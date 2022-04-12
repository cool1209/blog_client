// node_modules
import React from "react";
import { useHistory, Link } from "react-router-dom";
import {
    Heading,
    Text,
    Image,
    Stack,
    Divider,
    Button,
    Box,
    useToast,
} from "@chakra-ui/react";
import { ThumbUpRounded, DeleteRounded, EditRounded } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";

// slices
import { fetchDeleteBlog, fetchThumbUp } from "../../store/blogs-slice";
import { RootState } from "../../store";

// config
import { BASE_SERVER_API_URL } from "../../config";

// consts
import { PATH } from "../../consts";

// models
import Blog from "../../models/Blog";

type Props = {
    blog: Blog;
};

const BlogViewComponent: React.FC<Props> = ({ blog, ...props }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const me = useSelector((state: RootState) => state.me.me);
    const toast = useToast();

    const onThumbUp = () => {
        dispatch(
            fetchThumbUp(blog.id, (error: string) => {
                toast({
                    title: `${error}`,
                    status: "error",
                    isClosable: true,
                    duration: 3000,
                });
            })
        );
    };

    const onDeleteBlog = () => {
        dispatch(fetchDeleteBlog(blog.id));
        history.push(PATH.BLOGS);
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
                <Heading display={"flex"} justifyContent={"space-between"}>
                    <Text>{blog.title}</Text>
                    <Text>{blog.username}</Text>
                </Heading>
                <Divider></Divider>
                <Text>{blog.text}</Text>
                <Divider></Divider>
                {blog.imageUrl && (
                    <Image
                        width={"100%"}
                        height={"300px"}
                        src={`${BASE_SERVER_API_URL}${blog.imageUrl}`}
                    />
                )}
                {blog.imageUrl && <Divider></Divider>}
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                >
                    <Button onClick={onThumbUp}>
                        <ThumbUpRounded />
                    </Button>
                    &nbsp;&nbsp;
                    {blog.like}
                    &nbsp;&nbsp;
                    {me.id === blog.userId && (
                        <Box>
                            <Link to={`${PATH.UPDATE}/${blog.id}`}>
                                <Button>
                                    <EditRounded />
                                    Update
                                </Button>
                            </Link>
                            &nbsp;&nbsp;
                            <Button onClick={onDeleteBlog}>
                                <DeleteRounded />
                                Delete
                            </Button>
                        </Box>
                    )}
                </Box>
            </Stack>
        </>
    );
};

export default BlogViewComponent;
