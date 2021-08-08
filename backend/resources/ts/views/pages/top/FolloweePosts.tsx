import React, { useEffect, useState } from "react";
import axios from "axios";
import { RootState } from "../../../store";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { login_user } from "../../../store/counter/user/action";
import { Helmet } from "react-helmet";
import Posts from "../../components/Posts";

const FolloweePosts = () => {
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
                    path="/api/get/post/scroll/followee"
                    user_id={user.id}
                    defaultCurrency="followee"
                />
            </>
        );
    } else {
        return null;
    }
};

export default FolloweePosts;
