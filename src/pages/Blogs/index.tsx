// node_modules
import React, { useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

// components
import BlogSummaryComponent from "../../components/BlogSummary";

// slices
import { fetchBlogs } from "../../store/blogs-slice";

// states
import { RootState } from "../../store";

const BlogsPage = () => {
    const blogs = useSelector((state: RootState) => state.blogs.blogs);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchBlogs());
    }, [fetchBlogs]);

    return (
        <Box width={"90%"}>
            {blogs.length > 0 &&
                blogs.map((blog) => (
                    <BlogSummaryComponent key={blog.id} blog={blog} />
                ))}
        </Box>
    );
};

export default BlogsPage;
