import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./views/pages/login/Login";
import Register from "./views/pages/login/Register";
import Top from "./views/pages/top/Top";
import Create from "./views/pages/posts/Create";
import Auth from "./views/lauout/Auth";
import { Provider } from "react-redux";
import store from "./store/index";
import User from "./views/pages/user/User";
import IsLogin from "./views/lauout/IsLogin";
import View from "./views/pages/posts/View";
const App = () => {
    return (
        <Router>
            <Switch>
                <IsLogin>
                    <Switch>
                        <Route exact path="/" component={Top} />
                        <Route exact path="/:user/post/:id" component={View} />
                    </Switch>
                </IsLogin>
                <Auth>
                    <Switch>
                        <Route exact path="/create" component={Create} />
                        <Route exact path="/user" component={User} />
                    </Switch>
                </Auth>
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
/*
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
*/
