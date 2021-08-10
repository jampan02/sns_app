import axios from "axios";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { RootState } from "../../../store";
import { login_user } from "../../../store/counter/user/action";
import Posts from "../../components/Posts";

const LikedPosts = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user.user);

    useEffect(() => {
        //パラメーターに則ったユーザー情報取得
        const f = async () => {
            if (!user) {
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
        f();
    }, []);
    if (user) {
        return (
            <>
                <Helmet>
                    <title>フォロー中のユーザーの投稿 | ゆうあるえる</title>
                </Helmet>
                <Posts
                    path="/api/get/post/scroll/liked"
                    user_id={user.id}
                    defaultCurrency="liked"
                />
            </>
        );
    } else {
        return null;
    }
};

export default LikedPosts;
