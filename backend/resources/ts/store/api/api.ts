import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../index";
import { login_user } from "../counter/user/action";
import { useHistory } from "react-router";

const dispatch = useDispatch();
const isLogin = useSelector((state: RootState) => state.user.isLogin);
const user = useSelector((state: RootState) => state.user.user);
const history = useHistory();
export const getIsLogin = async () => {
    if (!user) {
        //ログインされていない場合

        await axios
            .get("/json")
            .then(res => {
                if (res.data) {
                    dispatch(login_user(res.data));
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
};

export const checkIsAuth = async () => {
    if (!isLogin) {
        await axios
            .get("/json")
            .then(res => {
                if (res.data) {
                    dispatch(login_user(res.data));
                } else {
                    history.push("/register");
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
};
