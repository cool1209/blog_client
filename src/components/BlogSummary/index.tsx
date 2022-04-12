// node_modules
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Heading, Text, Stack, Divider } from "@chakra-ui/react";
import { ThumbUp } from "@material-ui/icons";

// models
import Blog from "../../models/Blog";

// consts
import { PATH } from "../../consts";

// props type
type Props = {
    blog: Blog;
};

const BlogSummaryComponent: React.FC<Props> = ({ blog, ...props }) => {
    const location = useLocation();

    return (
        <>
            <Link to={`${PATH.BLOG}/${blog.id}`}>
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
                    <Text height={"25px"} overflowY={"hidden"}>
                        {blog.text}
                    </Text>
                    <Divider></Divider>
                    <Text
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"flex-end"}
                    >
                        <ThumbUp></ThumbUp>
                        &nbsp; &nbsp;
                        {blog.like}
                    </Text>
                </Stack>
            </Link>
        </>
    );
};

export default BlogSummaryComponent;
