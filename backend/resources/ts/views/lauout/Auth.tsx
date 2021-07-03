import React, { useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { login_user } from "../../store/counter/user/action";
import { RootState } from "../../store";
import CircularProgress from "@material-ui/core/CircularProgress";
type PROPS = {
    children: ReactNode;
};

const Auth: React.FC<PROPS> = ({ children }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user);
    const [isLogin, setIsLogin] = useState(false);
    useEffect(() => {
        const f = async () => {
            if (!user.user) {
                await axios
                    .get("/json")
                    .then(res => {
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
            } else {
                setIsLogin(true);
            }
        };
        f();
    }, [user]);
    return isLogin ? (
        <div>{children}</div>
    ) : (
        <div>
            <CircularProgress />
        </div>
    );
};

export default Auth;
