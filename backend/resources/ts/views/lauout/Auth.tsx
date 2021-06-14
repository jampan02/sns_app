import React, { useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { login_user } from "../../store/counter/action";
type PROPS = {
    children: ReactNode;
};

const Auth: React.FC<PROPS> = ({ children }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isLogin, setIsLogin] = useState(false);
    useEffect(() => {
        axios
            .get("/json")
            .then(res => {
                console.log(res);
                console.log(res.data.id);
                if (res.data) {
                    dispatch(login_user(res.data));
                    setIsLogin(true);
                } else {
                    history.push("/register");
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    return isLogin ? <div>{children}</div> : <div>no login</div>;
};

export default Auth;
