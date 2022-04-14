// node_modules
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

// components
import BlogEditComponent from "../../components/BlogEdit";

// store
import { fetchCertainBlog } from "../../store/blogs-slice";
import { RootState } from "../../store";

// models
import ApiError from "../../models/ApiError";

// consts
import { PATH } from "../../consts";

// config
import { SERVER_API_URL } from "../../config";

const UpdateBlogPage = () => {
    const API_URL = process.env.REACT_APP_BLOG_API_URL || SERVER_API_URL;
    const blog = useSelector((state: RootState) => state.blogs.blog);
    const history = useHistory();
    const toast = useToast();
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        dispatch(fetchCertainBlog(id));
    }, [dispatch, fetchCertainBlog, id]);

    const onUpdateBlog = async (
        title: string,
        text: string,
        imageUrl: string
    ) => {
        try {
            const response = await fetch(`${API_URL}/blogs/blog/${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    title,
                    text,
                    imageUrl,
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
        <BlogEditComponent
            data={{
                title: blog.title,
                text: blog.text,
                imageUrl: blog.imageUrl,
            }}
            setData={onUpdateBlog}
        ></BlogEditComponent>
    );
};

export default UpdateBlogPage;
