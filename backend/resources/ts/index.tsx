import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./views/pages/login/Login";
import Register from "./views/pages/login/Register";
import Top from "./views/pages/top/Top";
import Create from "./views/pages/posts/Create";
import { Provider } from "react-redux";
import store from "./store/index";
import LoginUser from "./views/pages/user/LoginUser";
import View from "./views/pages/posts/View";
import Poster from "./views/pages/user/Poster";
import Followee from "./views/pages/follow/Followee";
import Follower from "./views/pages/follow/Follower";
import Layout from "./views/lauout/Layout";
import PostResult from "./views/search/PostResult";
import UserResult from "./views/search/UserResult";
import Edit from "./views/pages/posts/Edit";
import Setting from "./views/pages/user/Setting";
import Unregisted from "./views/lauout/Unregisted";
import NotFound from "./views/pages/404/NotFound";
import FolloweePosts from "./views/pages/top/FolloweePosts";
import ResetPassword from "./views/pages/reset/ResetPassword";
import ChangePassword from "./views/pages/reset/ChangePassword";
import LikedPosts from "./views/pages/top/LikedPosts";
export let csrf_token = (document.head.querySelector(
    'meta[name="csrf-token"]'
) as HTMLMetaElement).content;
function AuthRoute({ layout, component, ...rest }: any) {
    return (
        <Route
            {...rest}
            render={props =>
                React.createElement(
                    layout,
                    props,
                    React.createElement(component, props)
                )
            }
        />
    );
}
function LayoutRoute({ layout, component, ...rest }: any) {
    return (
        <Route
            {...rest}
            render={props =>
                React.createElement(
                    layout,
                    props,
                    React.createElement(component, props)
                )
            }
        />
    );
}
function MustAuthRoute({ layout, component, ...rest }: any) {
    return (
        <Route
            {...rest}
            render={props =>
                React.createElement(
                    layout,
                    props,
                    React.createElement(component, props)
                )
            }
        />
    );
}
const App = () => {
    return (
        <Router>
            <Switch>
                <AuthRoute
                    exact
                    layout={Unregisted}
                    path="/register"
                    component={Register}
                />
                <AuthRoute
                    exact
                    layout={Unregisted}
                    path="/login"
                    component={Login}
                />

                <Route
                    exact
                    component={ChangePassword}
                    path="/password/reset/:csrf"
                />
                <AuthRoute
                    exact
                    layout={Unregisted}
                    path="/password/reset"
                    component={ResetPassword}
                />
                <LayoutRoute layout={Layout} exact path="/" component={Top} />
                <LayoutRoute
                    exact
                    layout={Layout}
                    path="/:user/post/:id"
                    component={View}
                />

                <LayoutRoute
                    exact
                    layout={Layout}
                    path="/:user/user/:id"
                    component={Poster}
                />
                <LayoutRoute
                    exact
                    layout={Layout}
                    path="/:user/followee/:id"
                    component={Followee}
                />
                <LayoutRoute
                    exact
                    layout={Layout}
                    path="/:user/follower/:id"
                    component={Follower}
                />
                <LayoutRoute
                    exact
                    layout={Layout}
                    path="/search/post"
                    component={PostResult}
                />
                <LayoutRoute
                    exact
                    layout={Layout}
                    path="/search/user"
                    component={UserResult}
                />
                <LayoutRoute
                    exact
                    layout={Layout}
                    path="/followee/posts"
                    component={FolloweePosts}
                />
                <LayoutRoute
                    exact
                    layout={Layout}
                    path="/liked/posts"
                    component={LikedPosts}
                />
                <MustAuthRoute
                    exact
                    layout={Layout}
                    path="/:user/edit/:id"
                    component={Edit}
                />

                <MustAuthRoute
                    exact
                    layout={Layout}
                    path="/create"
                    component={Create}
                />
                <MustAuthRoute
                    exact
                    layout={Layout}
                    path="/user"
                    component={LoginUser}
                />
                <MustAuthRoute
                    exact
                    layout={Layout}
                    path="/setting"
                    component={Setting}
                />
                <MustAuthRoute
                    exact
                    layout={Layout}
                    path="/confirm/user"
                    component={Setting}
                />
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
};

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("app")
);
