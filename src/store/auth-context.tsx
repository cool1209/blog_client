// node_modules
import React, { useEffect, useState } from "react";
import User from "../models/User";

let logoutTimer: NodeJS.Timeout;

type AuthContextObj = {
    token: string;
    userData: User;
    isLoggedIn: boolean;
    signin: (token: string, expirationTime: string) => void;
    setMe: (me: User) => void;
    logout: () => void;
};

const calculateRemainingTime = (expirationTime: string): number => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();

    const remainingDuration = adjExpirationTime - currentTime;

    return remainingDuration;
};

const AuthContext = React.createContext<AuthContextObj>({
    token: "",
    userData: {
        id: "",
        username: "",
        email: "",
        photoUrl: "",
    },
    isLoggedIn: false,
    signin: (token: string, expirationTime: string) => {},
    setMe: (user: User) => {},
    logout: () => {},
});

export const AuthProvider: React.FC = (props) => {
    let storedToken = localStorage.getItem("token");
    let storedExpirationDate = localStorage.getItem("duration");
    if (!storedToken) {
        storedToken = "";
    }
    let remainingTime = storedExpirationDate
        ? calculateRemainingTime(storedExpirationDate)
        : 0;

    const [token, setToken] = useState(storedToken);
    const [userData, setUserData] = useState({
        id: "",
        username: "",
        email: "",
        photoUrl: "",
    });

    useEffect(() => {
        if (remainingTime > 3600) {
            logoutTimer = setTimeout(logoutHandler, remainingTime);
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("expirationTime");
        }
    }, [remainingTime]);

    const signinHandler = (token: string, expirationTime: string) => {
        setToken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("duration", expirationTime);
        const remainingTime = calculateRemainingTime(expirationTime);
        logoutTimer = setTimeout(logoutHandler, remainingTime);
    };

    const logoutHandler = () => {
        setToken("");
        localStorage.removeItem("token");
        localStorage.removeItem("duration");
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    };

    const setMeHandler = (user: User) => {
        setUserData(user);
    };

    const authValue: AuthContextObj = {
        token: token,
        userData: userData,
        isLoggedIn: token !== "",
        signin: signinHandler,
        setMe: setMeHandler,
        logout: logoutHandler,
    };

    return (
        <AuthContext.Provider value={authValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
