// node_modules
import React, { useEffect, useState, useRef } from "react";
import { Box, Text, Stack, Button, Select, Input } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";

// components
import BlogSummaryComponent from "../../components/BlogSummary";
import PaginationComponent from "../../components/Pagination";

// slices
import { fetchBlogs } from "../../store/blogs-slice";

// states
import { RootState } from "../../store";

const BlogsPage = () => {
    const blogs = useSelector((state: RootState) => state.blogs.blogs);
    const count = useSelector((state: RootState) => state.blogs.count);
    const dispatch = useDispatch();

    const titleRef = useRef() as React.MutableRefObject<HTMLInputElement>;

    const [allPagesNumber, setAllPagesNumber] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [itemCount, setItemCount] = useState(5);
    const [title, setTitle] = useState("");

    useEffect(() => {
        dispatch(fetchBlogs(pageIndex, itemCount, title));
    }, [fetchBlogs, pageIndex, itemCount, title]);

    useEffect(() => {
        setAllPagesNumber(Math.ceil(count / itemCount));
    }, [count, itemCount]);

    return (
        <Box width={"90%"}>
            <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Box display={"flex"} alignItems={"center"}>
                    <Text>Count:</Text>
                    <Select
                        variant="outline"
                        defaultValue={itemCount}
                        onChange={(event) => {
                            setItemCount(Number(event.target.value));
                        }}
                    >
                        <option value={5}>5 Blogs</option>
                        <option value={10}>10 Blogs</option>
                        <option value={20}>20 Blogs</option>
                    </Select>
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                    <Text>Title:</Text>
                    <Input
                        width="auto"
                        placeholder="Please input search title"
                        ref={titleRef}
                    />
                    <Button onClick={() => setTitle(titleRef.current.value)}>
                        <SearchIcon />
                    </Button>
                </Box>
                <PaginationComponent
                    allPagesNumber={allPagesNumber}
                    itemsPerPage={itemCount}
                    itemsNumber={1}
                    pageChange={(page: number = 1) => {
                        setPageIndex(page);
                    }}
                />
            </Box>
            {blogs.length > 0 ? (
                blogs.map((blog) => (
                    <BlogSummaryComponent key={blog.id} blog={blog} />
                ))
            ) : (
                <Text>No search result!</Text>
            )}
        </Box>
    );
};

export default BlogsPage;
