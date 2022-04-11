// node_modules
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

// components
import BlogViewComponent from "../../components/BlogView";

// slices
import { fetchBlog } from "../../store/blogs-slice";

// states
import { RootState } from "../../store";

const BlogPage = () => {
    const blogs = useSelector((state: RootState) => state.blogs.blogs);
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        dispatch(fetchBlog(id));
    }, [fetchBlog]);

    return (
        <Box width={"90%"}>
            {blogs.length > 0 &&
                blogs.map((blog) => (
                    <BlogViewComponent key={blog.id} blog={blog} />
                ))}
        </Box>
    );
};

export default BlogPage;
