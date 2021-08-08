import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { RootState } from "../../../store";
import axios from "axios";
import { USER } from "../../../utils/type";
import { login_user } from "../../../store/counter/user/action";
import { Helmet } from "react-helmet";
import Posts from "../../components/Posts";
import User from "../../components/User";

type FollowLength = {
    followeeLength: number;
    followerLength: number;
};

const LoginUser = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const userData = useSelector((state: RootState) => state.user.user);
    const [user, setUser] = useState<USER>();
    const [followLength, setFollowLength] = useState<FollowLength>({
        followerLength: 0,
        followeeLength: 0
    });

    useEffect(() => {
        //パラメーターに則ったユーザー情報取得
        const f = async () => {
            if (userData) {
                setUser(userData);
                //該当のユーザーの、フォロー・フォロワー数取得
            } else {
                await axios
                    .get("/json")
                    .then(res => {
                        if (res.data) {
                            dispatch(login_user(res.data));
                            setUser(res.data);
                        } else {
                            history.push("/register");
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        };
        f();
    }, []);
    if (user) {
        return (
            <>
                <Helmet>
                    <title>ユーザーページ | ゆうあるえる</title>
                </Helmet>

                <User user={user} isLoginUser={true} />
                <Posts path="/api/get/post/scroll/user" user_id={user.id} />
            </>
        );
    } else {
        return null;
    }
};

export default LoginUser;
