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
            const f = async () => {
                console.log("hithere");
                await axios
                    .get("/json")
                    .then(res => {
                        console.log(res.data);
                        if (res.data) {
                            dispatch(login_user(res.data));
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            };
            f();
        }
    }, []);
    return <div>{children}</div>;
};

export default IsLogin;
