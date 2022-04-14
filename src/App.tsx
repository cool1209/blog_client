// node_modules
import React, { useContext, useEffect } from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

// pages
import HomePage from "./pages/Home";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import BlogsPage from "./pages/Blogs";
import BlogPage from "./pages/Blog";
import NewBlogPage from "./pages/NewBlog";
import UpdateBlogPage from "./pages/UpdateBlog";
import CommentPage from "./pages/Comment";
import ProfilePage from "./pages/Profile";

// components
import LayoutComponent from "./components/Layout";

// store
import { fetchMe } from "./store/me-slice";

// contexts
import AuthContext from "./store/auth-context";

// consts
import { PATH } from "./consts";

const App = () => {
    const authContext = useContext(AuthContext);
    const dispatch = useDispatch();
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

    useEffect(() => {
        if (authContext.token) {
            dispatch(fetchMe(authContext.token));
        }
    }, [dispatch, fetchMe, authContext.token]);

    return (
        <LayoutComponent>
            {!authContext.isLoggedIn && (
                <Switch>
                    <Route path={PATH.HOME} exact>
                        <HomePage />
                    </Route>
                    <Route path={PATH.SIGNIN}>
                        <SignInPage />
                    </Route>
                    <Route path={PATH.SIGNUP}>
                        <SignUpPage />
                    </Route>
                </Switch>
            )}
            {authContext.isLoggedIn && (
                <Switch>
                    <Route path={PATH.HOME} exact>
                        <HomePage />
                    </Route>
                    <Route path={PATH.BLOGS}>
                        <BlogsPage />
                    </Route>
                    <Route path={`${PATH.BLOG}/:id`}>
                        <BlogPage />
                    </Route>
                    <Route path={PATH.NEWBLOG}>
                        <NewBlogPage />
                    </Route>
                    <Route path={`${PATH.UPDATE}/:id`}>
                        <UpdateBlogPage />
                    </Route>
                    <Route path={`${PATH.COMMENT}/:id`}>
                        <CommentPage />
                    </Route>
                    <Route path={PATH.PROFILE}>
                        <ProfilePage />
                    </Route>
                </Switch>
            )}
        </LayoutComponent>
    );
};

export default App;
