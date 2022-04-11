// node_modules
import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";

// config
import { SERVER_API_URL } from "../config";

// model
import User from "../models/User";

const API_URL = process.env.REACT_APP_BIKES_API_URL || SERVER_API_URL;

type meState = {
    me: User;
    status: string;
};

const initialState: meState = {
    me: {
        id: "",
        username: "",
        email: "",
        photoUrl: "",
    },
    status: "completed",
};

const meSlice = createSlice({
    name: "me",
    initialState: initialState,
    reducers: {
        meRequest(state: meState) {
            state.me = {
                id: "",
                username: "",
                email: "",
                photoUrl: "",
            };
            state.status = "pending";
        },
        setMe(state: meState, action: PayloadAction<{ user: User }>) {
            state.me = action.payload.user;
            state.status = "completed";
        },
        requestFailure(state: meState) {
            state.status = "completed";
        },
    },
});

const userActions = meSlice.actions;

export const { setMe } = userActions;

export const fetchMe = (token: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(userActions.meRequest());
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const responseData: {
                user: User;
                message: string;
            } = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || response.statusText);
            }
            const { user } = responseData;
            dispatch(userActions.setMe({ user }));
        } catch (error) {
            dispatch(userActions.requestFailure());
        }
    };
};

export default meSlice;
