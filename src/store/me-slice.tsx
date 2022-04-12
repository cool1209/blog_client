// node_modules
import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";

// config
import { SERVER_API_URL } from "../config";

// model
import User from "../models/User";
import AuthenticatedUser from "../models/AuthUser";
import ApiError from "../models/ApiError";

const API_URL = SERVER_API_URL;

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
        logout: (state: meState) => {},
    },
});

const userActions = meSlice.actions;

export const { setMe, logout } = userActions;

export const fetchMe = (token: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(userActions.meRequest());
        try {
            const response = await fetch(`${API_URL}/users/me`, {
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

export const fetchSigninGoogle = (
    email: string,
    google: string,
    next: Function,
    errorHandler: Function
) => {
    return async (dispatch: Dispatch) => {
        try {
            const response = await fetch(`${API_URL}/auth/google`, {
                method: "POST",
                body: JSON.stringify({
                    email: email,
                    google: google,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                const responseData: ApiError = await response.json();
                throw new Error(responseData.message || response.statusText);
            }
            const responseData: AuthenticatedUser = await response.json();
            const expirationTime = new Date(
                new Date().getTime() + responseData.expirationTime * 1000
            );
            next({
                token: responseData.token,
                expirationTime: expirationTime.toISOString(),
            });
        } catch (error) {
            errorHandler(error);
        }
    };
};

export default meSlice;
