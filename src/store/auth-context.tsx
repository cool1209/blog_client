import React, { useEffect, useState } from "react";

let logoutTimer: NodeJS.Timeout;

type AuthContextObj = {
    token: string;
    userId: string;
    isLoggedIn: boolean;
    signin: (token: string, expirationTime: string, userId: string) => void;
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
    userId: "",
    isLoggedIn: false,
    signin: (token: string, expirationTime: string, userId: string) => {},
    logout: () => {},
});

export const AuthProvider: React.FC = (props) => {
    let storedToken = localStorage.getItem("token");
    let storedExpirationDate = localStorage.getItem("duration");
    let storedUserId = localStorage.getItem("userId");
    if (!storedToken) {
        storedToken = "";
    }
    if (!storedUserId) {
        storedUserId = "";
    }
    let remainingTime = storedExpirationDate
        ? calculateRemainingTime(storedExpirationDate)
        : 0;

    const [token, setToken] = useState(storedToken);
    const [userId, setUserId] = useState(storedUserId);

    useEffect(() => {
        if (remainingTime > 3600) {
            logoutTimer = setTimeout(logoutHandler, remainingTime);
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("expirationTime");
        }
    }, [remainingTime]);

    const signinHandler = (
        token: string,
        expirationTime: string,
        userId: string
    ) => {
        setToken(token);
        localStorage.setItem("token", token);
        setUserId(userId);
        localStorage.setItem("userId", userId);
        localStorage.setItem("duration", expirationTime);
        const remainingTime = calculateRemainingTime(expirationTime);
        logoutTimer = setTimeout(logoutHandler, remainingTime);
    };

    const logoutHandler = () => {
        setToken("");
        localStorage.removeItem("token");
        localStorage.removeItem("duration");
        setUserId("");
        localStorage.removeItem("userId");
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    };

    const authValue: AuthContextObj = {
        token: token,
        userId: userId,
        isLoggedIn: token !== "",
        signin: signinHandler,
        logout: logoutHandler,
    };

    return (
        <AuthContext.Provider value={authValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
