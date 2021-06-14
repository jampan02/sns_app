import axios from "axios";
import React, { useEffect, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { login_user } from "../../store/counter/action";
type PROPS = {
    children: ReactNode;
};

const IsLogin: React.FC<PROPS> = ({ children }) => {
    const dispatch = useDispatch();
    const isLogin = useSelector((state: RootState) => state.user.isLogin);
    useEffect(() => {
        if (!isLogin) {
            //ログインされていない場合
            axios
                .get("/json")
                .then(res => {
                    dispatch(login_user(res.data));
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, []);
    return <div>{children}</div>;
};

export default IsLogin;
