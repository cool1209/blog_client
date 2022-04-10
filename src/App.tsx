// node_modules
import * as React from "react";
import { useContext } from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";

// pages
import HomePage from "./pages/Home";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";

// components
import LayoutComponent from "./components/Layout";

// contexts
import AuthContext from "./store/auth-context";

// consts
import { PATH } from "./consts";

const App = () => {
    const authContext = useContext(AuthContext);
    const history = useHistory();
    const location = useLocation();

    if (
        location.pathname !== PATH.HOME &&
        location.pathname !== PATH.SIGNIN &&
        location.pathname !== PATH.SIGNUP &&
        !authContext.isLoggedIn
    ) {
        history.push(PATH.SIGNIN);
    }

    return (
        <LayoutComponent>
            <Switch>
                <Route path={PATH.HOME} exact>
                    <HomePage />
                </Route>
                {!authContext.isLoggedIn && (
                    <Route path={PATH.SIGNIN}>
                        <SignInPage />
                    </Route>
                )}
                {!authContext.isLoggedIn && (
                    <Route path={PATH.SIGNUP}>
                        <SignUpPage />
                    </Route>
                )}
            </Switch>
        </LayoutComponent>
    );
};

export default App;
