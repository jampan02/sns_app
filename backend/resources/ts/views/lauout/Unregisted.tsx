import React, { useEffect, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { useHistory } from "react-router";
import axios from "axios";
import { login_user } from "../../store/counter/user/action";
type PROPS = {
    children: ReactNode;
};
const Unregisted: React.FC<PROPS> = ({ children }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user.user);
    useEffect(() => {
        const f = async () => {
            if (user) {
                //ログイン中の場合、Topコンポーネントに飛ばす
                history.push("/");
                return;
            }
            await axios
                .get("/json")
                .then(res => {
                    if (res.data) {
                        if (res.data) {
                            dispatch(login_user(res.data));
                            history.push("/");
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        };
        f();
    }, []);
    return <div>{children}</div>;
};

export default Unregisted;
