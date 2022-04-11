// node_modules
import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";

// config
import { SERVER_API_URL } from "../config";

// model
import Blog from "../models/Blog";

const API_URL = process.env.REACT_APP_BIKES_API_URL || SERVER_API_URL;

type blogsState = {
    blogs: Blog[];
    mainBlogId: string;
    status: string;
};

const initialState: blogsState = {
    blogs: [],
    mainBlogId: "",
    status: "completed",
};

const blogsSlice = createSlice({
    name: "me",
    initialState: initialState,
    reducers: {
        readBlogsRequest(state: blogsState) {
            state.blogs = [];
            state.status = "pending";
        },
        readBlogRequest(
            state: blogsState,
            action: PayloadAction<{ blogId: string }>
        ) {
            state.blogs = [];
            state.status = "pending";
            state.mainBlogId = action.payload.blogId;
        },
        setBlogs(state: blogsState, action: PayloadAction<{ blogs: Blog[] }>) {
            state.blogs = action.payload.blogs;
            state.status = "completed";
        },
        thumbupBlog(
            state: blogsState,
            action: PayloadAction<{ blogId: string }>
        ) {
            state.blogs = state.blogs.map((blog: Blog) =>
                blog.id === action.payload.blogId
                    ? { ...blog, like: blog.like + 1 }
                    : blog
            );
            state.status = "completed";
        },
        requestFailure(state: blogsState) {
            state.status = "completed";
        },
    },
});

const blogsActions = blogsSlice.actions;

export const fetchBlogs = () => {
    return async (dispatch: Dispatch) => {
        dispatch(blogsActions.readBlogsRequest());
        try {
            const response = await fetch(`${API_URL}/blogs/blogs`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });
            const responseData: {
                blogs: Blog[];
                message: string;
            } = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || response.statusText);
            }
            const { blogs } = responseData;
            dispatch(blogsActions.setBlogs({ blogs }));
        } catch (error) {
            dispatch(blogsActions.requestFailure());
        }
    };
};

export const fetchBlog = (blogId: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(blogsActions.readBlogRequest({ blogId }));
        try {
            const response = await fetch(`${API_URL}/blogs/blog/${blogId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });
            const responseData: {
                blogs: Blog[];
                message: string;
            } = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || response.statusText);
            }
            const { blogs } = responseData;
            dispatch(blogsActions.setBlogs({ blogs }));
        } catch (error) {
            dispatch(blogsActions.requestFailure());
        }
    };
};

export const fetchThumbUp = (blogId: string) => {
    return async (dispatch: Dispatch) => {
        try {
            const response = await fetch(`${API_URL}/blogs/thumbup/${blogId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });
            const responseData: {
                message: string;
            } = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || response.statusText);
            }
            dispatch(blogsActions.thumbupBlog({ blogId }));
        } catch (error) {
            dispatch(blogsActions.requestFailure());
        }
    };
};

export default blogsSlice;
